"use client"

import { useEffect, useRef, useState } from "react"
import type { Hospital } from "@/types/hospital"
import { MapPin } from "lucide-react"
import type { google } from "google-maps"

interface HospitalMapProps {
    hospitals: Hospital[]
    selectedHospital?: Hospital
    onHospitalSelect: (hospital: Hospital) => void
    height?: string
}

export function HospitalMap({ hospitals, selectedHospital, onHospitalSelect, height = "400px" }: HospitalMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [markers, setMarkers] = useState<google.maps.Marker[]>([])
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)

    // Initialize Google Maps
    useEffect(() => {
        if (!mapRef.current || !window.google) return

        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: { lat: 10.8231, lng: 106.6297 }, // Ho Chi Minh City center
            zoom: 12,
            styles: [
                {
                    featureType: "poi.medical",
                    elementType: "geometry",
                    stylers: [{ color: "#ffeaa7" }],
                },
            ],
        })

        const infoWindowInstance = new window.google.maps.InfoWindow()

        setMap(mapInstance)
        setInfoWindow(infoWindowInstance)
    }, [])

    // Create markers for hospitals
    useEffect(() => {
        if (!map || !infoWindow) return

        // Clear existing markers
        markers.forEach((marker) => marker.setMap(null))

        const newMarkers = hospitals.map((hospital) => {
            const marker = new window.google.maps.Marker({
                position: {
                    lat: hospital.coordinates.latitude,
                    lng: hospital.coordinates.longitude
                },
                map: map,
                title: hospital.name,
                icon: {
                    url:
                        "data:image/svg+xml;charset=UTF-8," +
                        encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="15" fill="#ef4444" stroke="white" strokeWidth="2"/>
              <path d="M16 8v16M8 16h16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          `),
                    scaledSize: new window.google.maps.Size(32, 32),
                    anchor: new window.google.maps.Point(16, 16),
                },
            })

            marker.addListener("click", () => {
                onHospitalSelect(hospital)

                const content = `
          <div style="max-width: 300px; padding: 12px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${hospital.name}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; display: flex; align-items: center; gap: 4px;">
              <span>📍</span> ${hospital.address}
            </p>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; display: flex; align-items: center; gap: 4px;">
              <span>📞</span> ${hospital.phone}
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">
              ${hospital.specialties
                    .slice(0, 3)
                    .map(
                        (spec) =>
                            `<span style="background: #e5e7eb; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${spec}</span>`,
                    )
                    .join("")}
            </div>
            <button 
              onclick="window.selectHospital('${hospital.id}')"
              style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; width: 100%;"
            >
              Chọn bệnh viện này
            </button>
          </div>
        `

                infoWindow.setContent(content)
                infoWindow.open(map, marker)
            })

            return marker
        })

        setMarkers(newMarkers)

        // Fit map to show all markers
        if (hospitals.length > 0) {
            const bounds = new window.google.maps.LatLngBounds()
            hospitals.forEach((hospital) => {
                bounds.extend({
                    lat: hospital.coordinates.latitude,
                    lng: hospital.coordinates.longitude
                })
            })
            map.fitBounds(bounds)
        }
    }, [hospitals, map, infoWindow, onHospitalSelect])

    // Highlight selected hospital
    useEffect(() => {
        if (!selectedHospital || !map) return

        map.setCenter({
            lat: selectedHospital.coordinates.latitude,
            lng: selectedHospital.coordinates.longitude
        })
        map.setZoom(15)
    }, [selectedHospital, map])

    // Global function for info window button
    useEffect(() => {
        ;(window as any).selectHospital = (hospitalId: string) => {
            const hospital = hospitals.find((h) => h.id === hospitalId)
            if (hospital) {
                onHospitalSelect(hospital)
                if (infoWindow) {
                    infoWindow.close()
                }
            }
        }

        return () => {
            delete (window as any).selectHospital
        }
    }, [hospitals, onHospitalSelect, infoWindow])

    return (
        <div className="relative">
            <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg" />

            {!window.google && (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
                    <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Đang tải bản đồ...</p>
                        <p className="text-sm text-gray-500 mt-2">Cần Google Maps API key để hiển thị bản đồ</p>
                    </div>
                </div>
            )}
        </div>
    )
}