import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import L from 'leaflet'

const Map = ({ bookingLocation, center }) => {

    const blueMarker = L.icon({ iconUrl: "/images/leaflet/map-marker-blue.png" })
    const towMarker = L.icon({ iconUrl: "/images/leaflet/tow-truck.png" })

    const fromLocation = bookingLocation[0] || { latitude: 0, longitude: 0 }
    const toLocation = bookingLocation[1] || { latitude: 0, longitude: 0 }

    return (
        <div className="h-80">
            <MapContainer className="h-full" center={[center.latitude, center.longitude]} zoom={20} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[fromLocation.latitude, fromLocation.longitude]} icon={blueMarker}>
                    <Popup>
                        From: {fromLocation.latitude}, {fromLocation.longitude}
                    </Popup>
                </Marker>

                <Marker position={[toLocation.latitude, toLocation.longitude]} icon={towMarker}>
                    <Popup>
                        To: {toLocation.latitude}, {toLocation.longitude}
                    </Popup>
                </Marker>
            </MapContainer>
        </div >
    )
}

export default Map