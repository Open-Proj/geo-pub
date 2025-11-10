import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useGeolocated } from "react-geolocated";
import { useEffect, useState } from "react";
import { Alert } from "@heroui/react";

interface Pondering {
    id: number;
    pondering: string;
    lat: number;
    lng: number;
    created_at: string;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export function Map() {
    const [ponderings, setPonderings] = useState<Pondering[]>([]);

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

    // Fetch ponderings near current location
    useEffect(() => {
        const fetchPonderings = async () => {
            try {
                const [lat, lng] = center;
                const response = await fetch(
                    `http://localhost:8000/visions/near?lat=${lat}&lng=${lng}&radius=50000`
                );
                const data = await response.json();
                setPonderings(data.visions || []);
            } catch (error) {
                console.error('Failed to fetch ponderings:', error);
            }
        };

        fetchPonderings();
        const interval = setInterval(fetchPonderings, 10000);
        return () => clearInterval(interval);
    }, [center]);

    // Add debug logging
    console.log('Geolocation state:', {
        coords,
        isGeolocationAvailable,
        isGeolocationEnabled,
        positionError,
        center,
        ponderings
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
                {ponderings.map((pondering) => (
                    <Marker key={pondering.id} position={[pondering.lat, pondering.lng]}>
                        <Popup>
                            🔮 {pondering.pondering}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
