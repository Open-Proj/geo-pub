import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useGeolocated } from "react-geolocated";
import { useEffect, useState, useMemo } from "react";
import { Alert, Button } from "@heroui/react";
import type { Map as LeafletMap } from "leaflet";

const LOCAL_STORAGE_CENTER = "map.center";

// Component to handle map events
function MapEventHandler({ onMoveEnd }: { onMoveEnd: (center: [number, number, number]) => void }) {
    useMapEvents({
        moveend: (e) => {
            const map = e.target;
            const center = map.getCenter();
            const zoom = map.getZoom();
            onMoveEnd([zoom, center.lat, center.lng]);
        }
    });
    return null;
}

export function Map() {
    // Get user position
    const { coords: realCoords, isGeolocationAvailable, isGeolocationEnabled, positionError } = useGeolocated();

    const defaultCenter = useMemo(() => realCoords || [13, 51.505, -0.09], [realCoords]);
    const storedCenter = localStorage.getItem(LOCAL_STORAGE_CENTER);
    const [ center, setCenter ] = useState(storedCenter !== null ? JSON.parse(storedCenter) : defaultCenter);
    useEffect(() => {
        // Save current center when use leaves page
        return () => {
            localStorage.setItem(LOCAL_STORAGE_CENTER, JSON.stringify(center));
        };
    });
    console.table({
        defaultCenter, center, storedCenter
    });

    // Get more detailed error message
    const getErrorMessage = (error: GeolocationPositionError | undefined) => {
        if (!error) return '';

        switch (error.code) {
            case error.PERMISSION_DENIED:
                return 'Location permission denied. Please allow location access in your browser settings.';
            case error.POSITION_UNAVAILABLE:
                return 'Location information unavailable. Please check your device location settings.';
            case error.TIMEOUT:
                return 'Location request timed out. Please try again.';
            default:
                return error.message || 'Unable to get your location. Showing default location.';
        }
    };

    return (
        <div className="h-screen w-full">
            {/* Geolocation alerts */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4 space-y-2">
                {!isGeolocationAvailable && (
                    <Alert
                        color="danger"
                        variant="faded"
                        title="Geolocation Not Supported"
                        classNames={{
                            base: "bg-red-50 border border-red-200"
                        }}
                    >
                        Your browser doesn't support geolocation
                    </Alert>
                )}

                {positionError && (
                    <Alert
                        color="warning"
                        variant="faded"
                        title="Location Error"
                        isClosable
                        classNames={{
                            base: "bg-yellow-50 border border-yellow-200"
                        }}
                    >
                        {getErrorMessage(positionError)}
                    </Alert>
                )}
            </div>

            <MapContainer
                center={[center[1], center[2]]}
                zoom={center[0]}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEventHandler onMoveEnd={setCenter} />
                <Marker position={center}>
                    <Popup>
                        {center ? 'Your location' : 'Default location (London)'}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
