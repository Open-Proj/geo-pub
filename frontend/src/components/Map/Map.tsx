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

    return (
        <div className="h-screen w-full">
            {/* Geolocation alerts */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4 space-y-2">
                {!isGeolocationAvailable && (
                    <Alert color="danger" variant="faded" title="Geolocation Not Supported">
                        Your browser doesn't support geolocation
                    </Alert>
                )}

                {positionError && (
                    <Alert color="warning" variant="faded" title="Location Error">
                        {positionError.message || 'Could not get your location. Showing default location.'}
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
