import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useGeolocated } from "react-geolocated";
import { useEffect } from "react";
import { Alert } from "@heroui/react";

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export function Map() {
    // Get user position
    const { coords, isGeolocationAvailable, isGeolocationEnabled, positionError } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0,
        },
        userDecisionTimeout: 10000,
        watchPosition: false,
        suppressLocationOnMount: false,
    });

    // Default to London, use user location if available
    // Note: Leaflet uses [latitude, longitude] order
    const defaultCenter: [number, number] = [51.505, -0.09];
    const center: [number, number] = coords
        ? [coords.latitude, coords.longitude]
        : defaultCenter;

    // Add debug logging
    console.log('Geolocation state:', {
        coords,
        isGeolocationAvailable,
        isGeolocationEnabled,
        positionError,
        center
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
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <MapUpdater center={center} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>
                        {coords ? 'Your location' : 'Default location (London)'}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
