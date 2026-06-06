/// <reference types="vite/client" />
/// <reference types="google.maps" />

import { useEffect, useRef, useState } from "react";
import { Calendar, Car, Clock, CreditCard, MapPin, Navigation, Shield } from "lucide-react";
import { openWhatsAppChat } from "../config/whatsapp";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

declare global {
  interface Window {
    google: typeof google;
  }
}

const features = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Book a ride anytime, anywhere with our round-the-clock service",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Verified drivers and GPS tracking for your peace of mind",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Multiple payment options including cash, card, and digital wallets",
  },
  {
    icon: Car,
    title: "Premium Fleet",
    description: "Choose from economy to luxury vehicles for every occasion",
  },
];

type BookingType = "normal" | "package";
type PickingTarget = "pickup" | "dropoff";
type Coordinates = google.maps.LatLngLiteral | null;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const pricePerKm: Record<string, number> = {
  Sedans: 12,
  "SUV / MUV": 15,
  Premium: 20,
  Van: 18,
  "Bus / Large Group": 25,
};

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const GOOGLE_MAPS_SCRIPT_ID = "google-maps-script";
const GOOGLE_MAPS_LOAD_TIMEOUT_MS = 12000;
let googleMapsLoadPromise: Promise<void> | null = null;

function hasGoogleMapsCoreLoaded() {
  return Boolean(
    window.google?.maps &&
      typeof window.google.maps.Map === "function" &&
      typeof window.google.maps.Geocoder === "function",
  );
}

function resetGoogleMapsLoader() {
  const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
  existingScript?.remove();
  googleMapsLoadPromise = null;
}

function loadGoogleMapsScript(apiKey: string) {
  if (hasGoogleMapsCoreLoaded()) {
    return Promise.resolve();
  }

  if (googleMapsLoadPromise) {
    return googleMapsLoadPromise;
  }

  googleMapsLoadPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;
    let timeoutId: number | null = null;

    const clearLoadTimeout = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const startLoadTimeout = () => {
      timeoutId = window.setTimeout(() => {
        clearLoadTimeout();
        resetGoogleMapsLoader();
        reject(new Error("Google Maps script timed out while loading."));
      }, GOOGLE_MAPS_LOAD_TIMEOUT_MS);
    };

    const handleLoad = () => {
      clearLoadTimeout();
      if (hasGoogleMapsCoreLoaded()) {
        resolve();
        return;
      }

      resetGoogleMapsLoader();
      reject(new Error("Google Maps script loaded but maps namespace is unavailable."));
    };

    const handleError = () => {
      clearLoadTimeout();
      resetGoogleMapsLoader();
      reject(new Error("Failed to load Google Maps"));
    };

    if (existingScript) {
      if (hasGoogleMapsCoreLoaded() || existingScript.dataset.loaded === "true") {
        handleLoad();
        return;
      }

      existingScript.addEventListener(
        "load",
        () => {
          existingScript.dataset.loaded = "true";
          handleLoad();
        },
        { once: true },
      );
      existingScript.addEventListener("error", handleError, { once: true });
      startLoadTimeout();
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        handleLoad();
      },
      { once: true },
    );
    script.addEventListener("error", handleError, { once: true });
    startLoadTimeout();
    document.head.appendChild(script);
  });

  return googleMapsLoadPromise;
}

export function TaxiService() {
  const [bookingType] = useState<BookingType>("package");
  const [normalBooking, setNormalBooking] = useState({
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    vehicleType: "Sedans",
  });
  const [packageBooking, setPackageBooking] = useState({
    fromLocation: "",
    destination: "",
    startDate: "",
    endDate: "",
    days: "",
    vehicleType: "Sedans",
    passengers: "",
  });
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [activePicker, setActivePicker] = useState<PickingTarget>("pickup");
  const [selectionAddress, setSelectionAddress] = useState("");
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [selectionCoords, setSelectionCoords] = useState<Coordinates>(null);
  const [isResolvingSelection, setIsResolvingSelection] = useState(false);
  const [isConfirmingSelection, setIsConfirmingSelection] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<Coordinates>(null);
  const [dropoffCoords, setDropoffCoords] = useState<Coordinates>(null);

  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);
  const activePickerRef = useRef<PickingTarget>("pickup");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null);
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocodeRequestIdRef = useRef(0);
  const mapIdleListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const mapInitFrameRef = useRef<number | null>(null);
  const mapRepaintTimeoutsRef = useRef<number[]>([]);
  const mapResizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setMapError("Add VITE_GOOGLE_MAPS_API_KEY to enable map selection and route distance.");
      return;
    }

    let isMounted = true;

    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then(() => {
        if (!isMounted) {
          return;
        }

        setMapReady(true);
        setMapError(null);
      })
      .catch(() => {
        if (isMounted) {
          setMapReady(false);
          setMapError("Google Maps could not be loaded. Check the API key and enabled APIs.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isMapPickerOpen || mapReady || !GOOGLE_MAPS_API_KEY) {
      return;
    }

    let isMounted = true;

    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then(() => {
        if (!isMounted) {
          return;
        }

        setMapReady(true);
        setMapError(null);
      })
      .catch(() => {
        if (isMounted) {
          setMapReady(false);
          setMapError("Google Maps could not be loaded. Check the API key and enabled APIs.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isMapPickerOpen, mapReady]);

  useEffect(() => {
    activePickerRef.current = activePicker;
  }, [activePicker]);

  const clearMapRepaintTimeouts = () => {
    mapRepaintTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    mapRepaintTimeoutsRef.current = [];
  };

  const scheduleMapRepaint = (map: google.maps.Map, center: google.maps.LatLngLiteral, zoom: number) => {
    clearMapRepaintTimeouts();

    const repaint = () => {
      window.google.maps.event.trigger(map, "resize");
      map.setCenter(center);
      map.setZoom(zoom);
    };

    [0, 120, 260, 420].forEach((delay) => {
      const timeoutId = window.setTimeout(repaint, delay);
      mapRepaintTimeoutsRef.current.push(timeoutId);
    });
  };

  useEffect(() => {
    if (!mapReady || !isMapPickerOpen || !mapContainerRef.current) {
      return;
    }

    let isDisposed = false;

    const initializeMap = () => {
      if (isDisposed) {
        return;
      }

      const container = mapContainerRef.current;

      if (!container) {
        return;
      }

      if (container.clientWidth === 0 || container.clientHeight === 0) {
        mapInitFrameRef.current = window.requestAnimationFrame(initializeMap);
        return;
      }

      try {
        const activeCoords = activePickerRef.current === "pickup" ? pickupCoords : dropoffCoords;
        const fallbackCoords = activePickerRef.current === "pickup" ? dropoffCoords : pickupCoords;
        const initialCenter = activeCoords || fallbackCoords || DEFAULT_CENTER;
        const initialZoom = activeCoords || fallbackCoords ? 15 : 5;

        const map = new window.google.maps.Map(container, {
          center: initialCenter,
          zoom: initialZoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        });

        mapRef.current = map;
        setMapError(null);

        geocoderRef.current = new window.google.maps.Geocoder();
        directionsServiceRef.current = new window.google.maps.DirectionsService();
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#f97316",
            strokeOpacity: 0.9,
            strokeWeight: 5,
          },
        });
        directionsRendererRef.current.setMap(map);

        if (typeof ResizeObserver !== "undefined") {
          mapResizeObserverRef.current = new ResizeObserver(() => {
            window.google.maps.event.trigger(map, "resize");
          });
          mapResizeObserverRef.current.observe(container);
        }

        scheduleMapRepaint(map, initialCenter, initialZoom);

        mapIdleListenerRef.current = map.addListener("idle", () => {
          const center = map.getCenter();
          if (!center) {
            return;
          }

          reverseGeocodeSelection(center.toJSON());
        });

        reverseGeocodeSelection(initialCenter);
      } catch {
        setMapError("Map could not be initialized. Please retry map load.");
      }
    };

    mapInitFrameRef.current = window.requestAnimationFrame(initializeMap);

    return () => {
      isDisposed = true;

      if (mapInitFrameRef.current !== null) {
        window.cancelAnimationFrame(mapInitFrameRef.current);
        mapInitFrameRef.current = null;
      }

      clearMapRepaintTimeouts();
      mapResizeObserverRef.current?.disconnect();
      mapResizeObserverRef.current = null;
      mapIdleListenerRef.current?.remove();
      mapIdleListenerRef.current = null;
      directionsRendererRef.current?.setMap(null);
      directionsRendererRef.current = null;
      pickupMarkerRef.current?.setMap(null);
      pickupMarkerRef.current = null;
      dropoffMarkerRef.current?.setMap(null);
      dropoffMarkerRef.current = null;
      mapRef.current = null;
    };
  }, [mapReady, isMapPickerOpen]);

  useEffect(() => {
    if (!isMapPickerOpen || !mapRef.current) {
      return;
    }

    const map = mapRef.current;

    const coords = activePicker === "pickup" ? pickupCoords : dropoffCoords;
    const fallbackCoords = activePicker === "pickup" ? dropoffCoords : pickupCoords;
    const nextCenter = coords || fallbackCoords || DEFAULT_CENTER;

    scheduleMapRepaint(map, nextCenter, coords || fallbackCoords ? 15 : 5);
    reverseGeocodeSelection(nextCenter);
  }, [activePicker, isMapPickerOpen, pickupCoords, dropoffCoords]);

  useEffect(() => {
    if (!isMapPickerOpen) {
      return;
    }

    const coords = activePicker === "pickup" ? pickupCoords : dropoffCoords;
    const fallbackCoords = activePicker === "pickup" ? dropoffCoords : pickupCoords;
    const nextCenter = coords || fallbackCoords || DEFAULT_CENTER;

    reverseGeocodeSelection(nextCenter);
  }, [activePicker, isMapPickerOpen]);

  useEffect(() => {
    if (!mapReady || !pickupInputRef.current || !dropoffInputRef.current) {
      return;
    }

    if (!window.google?.maps?.places) {
      return;
    }

    if (!pickupAutocompleteRef.current) {
      pickupAutocompleteRef.current = new window.google.maps.places.Autocomplete(pickupInputRef.current, {
        fields: ["formatted_address", "geometry", "name"],
      });
      pickupAutocompleteRef.current.addListener("place_changed", () => {
        const place = pickupAutocompleteRef.current?.getPlace();
        handleAutocompletePlace("pickup", place);
      });
    }

    if (!dropoffAutocompleteRef.current) {
      dropoffAutocompleteRef.current = new window.google.maps.places.Autocomplete(dropoffInputRef.current, {
        fields: ["formatted_address", "geometry", "name"],
      });
      dropoffAutocompleteRef.current.addListener("place_changed", () => {
        const place = dropoffAutocompleteRef.current?.getPlace();
        handleAutocompletePlace("dropoff", place);
      });
    }
  }, [mapReady]);

  useEffect(() => {
    updateMarker("pickup", pickupCoords);
  }, [pickupCoords]);

  useEffect(() => {
    updateMarker("dropoff", dropoffCoords);
  }, [dropoffCoords]);

  useEffect(() => {
    if (!pickupCoords || !dropoffCoords || !directionsServiceRef.current || !directionsRendererRef.current) {
      directionsRendererRef.current?.set("directions", null);
      setDistance(null);
      setDuration(null);
      return;
    }

    directionsServiceRef.current.route(
      {
        origin: pickupCoords,
        destination: dropoffCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (
        result: google.maps.DirectionsResult | null,
        status: "INVALID_REQUEST" | "MAX_WAYPOINTS_EXCEEDED" | "NOT_FOUND" | "OK" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "UNKNOWN_ERROR" | "ZERO_RESULTS",
      ) => {
        if (status !== "OK" || !result) {
          setDistance(null);
          setDuration(null);
          return;
        }

        directionsRendererRef.current?.setDirections(result);

        const legSummary = result.routes[0]?.legs?.reduce(
          (accumulator: { distance: number; duration: number }, leg: google.maps.DirectionsLeg) => {
            accumulator.distance += leg.distance?.value ?? 0;
            accumulator.duration += leg.duration?.value ?? 0;
            return accumulator;
          },
          { distance: 0, duration: 0 },
        );

        const distanceInKm = legSummary ? Number((legSummary.distance / 1000).toFixed(1)) : null;
        const durationInMinutes = legSummary ? Math.max(1, Math.round(legSummary.duration / 60)) : null;

        setDistance(distanceInKm);
        setDuration(durationInMinutes ? `${durationInMinutes} mins` : null);
      },
    );
  }, [pickupCoords, dropoffCoords]);

  const updateMarker = (target: PickingTarget, coords: Coordinates) => {
    if (!mapRef.current) {
      return;
    }

    const markerRef = target === "pickup" ? pickupMarkerRef : dropoffMarkerRef;

    if (!coords) {
      markerRef.current?.setMap(null);
      markerRef.current = null;
      return;
    }

    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        map: mapRef.current,
        position: coords,
        title: target === "pickup" ? "Pickup" : "Drop-off",
        label: target === "pickup" ? "P" : "D",
      });
    } else {
      markerRef.current.setPosition(coords);
    }

    if (pickupCoords && dropoffCoords) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(pickupCoords);
      bounds.extend(dropoffCoords);
      mapRef.current.fitBounds(bounds, 60);
    } else {
      mapRef.current.panTo(coords);
      mapRef.current.setZoom(13);
    }
  };

  const reverseGeocodeWithGoogle = (coords: google.maps.LatLngLiteral) => {
    return new Promise<string | null>((resolve) => {
      if (!geocoderRef.current) {
        resolve(null);
        return;
      }

      geocoderRef.current.geocode(
        { location: coords },
        (
          results: google.maps.GeocoderResult[] | null,
          status: "INVALID_REQUEST" | "OK" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "UNKNOWN_ERROR" | "ZERO_RESULTS" | "ERROR",
        ) => {
          if (status !== "OK" || !results?.[0]?.formatted_address) {
            resolve(null);
            return;
          }

        resolve(results[0].formatted_address);
      });
    });
  };

  const reverseGeocodeWithOpenStreetMap = async (coords: google.maps.LatLngLiteral) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as { display_name?: string };
      return data.display_name || null;
    } catch {
      return null;
    }
  };

  const resolveAddressForCoords = async (coords: google.maps.LatLngLiteral) => {
    const googleAddress = await reverseGeocodeWithGoogle(coords);
    if (googleAddress) {
      return googleAddress;
    }

    return reverseGeocodeWithOpenStreetMap(coords);
  };

  const reverseGeocodeSelection = async (coords: google.maps.LatLngLiteral) => {
    const requestId = ++geocodeRequestIdRef.current;
    setIsResolvingSelection(true);
    setSelectionError(null);
    setSelectionCoords(coords);

    const resolvedAddress = await resolveAddressForCoords(coords);

    if (requestId !== geocodeRequestIdRef.current) {
      return;
    }

    setIsResolvingSelection(false);

    if (!resolvedAddress) {
      setSelectionAddress("");
      setSelectionError("Unable to fetch address for this point. Move the map slightly and try again.");
      return;
    }

    setSelectionAddress(resolvedAddress);
  };

  const handleAutocompletePlace = (target: PickingTarget, place?: google.maps.places.PlaceResult) => {
    const address = place?.formatted_address || place?.name;
    const location = place?.geometry?.location;

    if (!address || !location) {
      return;
    }

    const coords = location.toJSON();

    if (target === "pickup") {
      setNormalBooking((prev) => ({ ...prev, pickup: address }));
      setPickupCoords(coords);
    } else {
      setNormalBooking((prev) => ({ ...prev, dropoff: address }));
      setDropoffCoords(coords);
    }

    mapRef.current?.panTo(coords);
    mapRef.current?.setZoom(15);
  };

  const calculateFare = () => {
    if (!distance) {
      return 0;
    }

    const baseRate = pricePerKm[normalBooking.vehicleType] || 12;
    return Math.round(distance * baseRate);
  };

  const handleNormalInputChange = (field: "pickup" | "dropoff", value: string) => {
    setNormalBooking((prev) => ({ ...prev, [field]: value }));

    if (!value.trim()) {
      if (field === "pickup") {
        setPickupCoords(null);
      } else {
        setDropoffCoords(null);
      }
    }
  };

  const handleLocationFieldFocus = (target: PickingTarget) => {
    setMapError(null);
    setActivePicker(target);
    setIsMapPickerOpen(true);
  };

  const retryMapLoad = () => {
    if (!GOOGLE_MAPS_API_KEY) {
      setMapError("Add VITE_GOOGLE_MAPS_API_KEY to enable map selection and route distance.");
      return;
    }

    resetGoogleMapsLoader();
    setMapReady(false);
    setMapError(null);

    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then(() => {
        setMapReady(true);
        setMapError(null);
      })
      .catch(() => {
        setMapReady(false);
        setMapError("Google Maps could not be loaded. Check the API key and enabled APIs.");
      });
  };

  const confirmMapSelection = async () => {
    if (!selectionCoords) {
      return;
    }

    setSelectionError(null);
    setIsConfirmingSelection(true);

    const confirmedAddress = selectionAddress || (await resolveAddressForCoords(selectionCoords));

    setIsConfirmingSelection(false);

    if (!confirmedAddress) {
      setSelectionError("Address is not ready yet. Move the map slightly or wait a moment, then try again.");
      return;
    }

    if (activePickerRef.current === "pickup") {
      setNormalBooking((prev) => ({ ...prev, pickup: confirmedAddress }));
      setPickupCoords(selectionCoords);
      setActivePicker("dropoff");
    } else {
      setNormalBooking((prev) => ({ ...prev, dropoff: confirmedAddress }));
      setDropoffCoords(selectionCoords);
    }

    setIsMapPickerOpen(false);
  };

  const handleBookNormalTaxi = () => {
    const distanceText = distance ? `\nDistance: ${distance} km` : "";
    const durationText = duration ? `\nDuration: ${duration}` : "";
    const fareText = distance ? `\nEstimated Fare: Rs. ${calculateFare()}` : "";

    const message = `Hello! I would like to book a taxi with the following details:\n\n*Normal Taxi Booking*\nPickup: ${normalBooking.pickup || "Not specified"}\nDrop-off: ${normalBooking.dropoff || "Not specified"}${distanceText}${durationText}\nDate: ${normalBooking.date || "Not specified"}\nTime: ${normalBooking.time || "Not specified"}\nVehicle Type: ${normalBooking.vehicleType}${fareText}\n\nPlease confirm availability and final fare.`;

    openWhatsAppChat(message);
  };

  const handleBookPackageTaxi = () => {
    const message = `Hello! I would like to book a taxi package with the following details:\n\n*Taxi Package Booking (Multiple Days)*\nFrom: ${packageBooking.fromLocation || "Not specified"}\nDestination: ${packageBooking.destination || "Not specified"}\nStart Date: ${packageBooking.startDate || "Not specified"}\nEnd Date: ${packageBooking.endDate || "Not specified"}\nNumber of Days: ${packageBooking.days || "Not specified"}\nPassengers: ${packageBooking.passengers || "Not specified"}\nVehicle Type: ${packageBooking.vehicleType}\n\nPlease share package details and pricing.`;

    openWhatsAppChat(message);
  };

  return (
    <section id="taxi" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Premium Taxi Service
              <span className="block mt-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Ride with Comfort
              </span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Experience hassle-free transportation with our premium taxi service. Whether you need a quick ride across town or a comfortable journey to the airport, we&apos;ve got you covered.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8">
              Download App
            </Button>
          </div>

          <div>
            <Card className="p-8 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <h3 className="text-2xl font-bold mb-6">Book Your Ride</h3>

              {/*
              <div className="mb-6 flex items-center">
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700"
                  onClick={() => setBookingType("package")}
                >
                  <Calendar className="h-4 w-4" />
                  Package Booking
                </button>
              </div>
              */}

              {bookingType === "normal" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Pickup Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                      <input
                        ref={pickupInputRef}
                        type="text"
                        placeholder="Search pickup location"
                        className={`w-full h-12 pl-12 pr-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                          activePicker === "pickup" ? "border-orange-400 bg-orange-50/40" : "border-gray-300"
                        }`}
                        value={normalBooking.pickup}
                        onChange={(event) => handleNormalInputChange("pickup", event.target.value)}
                        onFocus={() => handleLocationFieldFocus("pickup")}
                        onClick={() => handleLocationFieldFocus("pickup")}
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Drop-off Location</label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                      <input
                        ref={dropoffInputRef}
                        type="text"
                        placeholder="Search destination"
                        className={`w-full h-12 pl-12 pr-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                          activePicker === "dropoff" ? "border-orange-400 bg-orange-50/40" : "border-gray-300"
                        }`}
                        value={normalBooking.dropoff}
                        onChange={(event) => handleNormalInputChange("dropoff", event.target.value)}
                        onFocus={() => handleLocationFieldFocus("dropoff")}
                        onClick={() => handleLocationFieldFocus("dropoff")}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                    <p className="text-sm font-semibold text-gray-900">Choose locations from the map</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Tap `Pickup Location` or `Drop-off Location` to open the map picker and confirm the exact point.
                    </p>
                  </div>

                  {distance && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-700">Distance:</span>
                          <p className="font-semibold text-green-900">{distance} km</p>
                        </div>
                        {duration && (
                          <div>
                            <span className="text-green-700">Duration:</span>
                            <p className="font-semibold text-green-900">{duration}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Date</label>
                      <Input type="date" className="h-12" value={normalBooking.date} onChange={(event) => setNormalBooking({ ...normalBooking, date: event.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Time</label>
                      <Input type="time" className="h-12" value={normalBooking.time} onChange={(event) => setNormalBooking({ ...normalBooking, time: event.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Vehicle Type</label>
                    <select
                      className="w-full h-12 px-3 rounded-lg border border-gray-300 bg-white"
                      value={normalBooking.vehicleType}
                      onChange={(event) => setNormalBooking({ ...normalBooking, vehicleType: event.target.value })}
                    >
                      <option>Sedans</option>
                      <option>SUV / MUV</option>
                      <option>Premium</option>
                      <option>Van</option>
                      <option>Bus / Large Group</option>
                    </select>
                  </div>

                  {distance && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Estimated Fare</span>
                        <span className="text-2xl font-bold text-blue-600">Rs. {calculateFare()}</span>
                      </div>
                      <p className="text-xs text-gray-500">Based on {distance} km at Rs. {pricePerKm[normalBooking.vehicleType]}/km</p>
                      <p className="text-xs text-gray-500 mt-1">Final fare may vary based on traffic and route.</p>
                    </div>
                  )}

                  <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" onClick={handleBookNormalTaxi}>
                    <Car className="w-5 h-5 mr-2" />
                    Book Now
                  </Button>
                </div>
              )}

              {bookingType === "package" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">From</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="e.g., Bangalore"
                        className="pl-12 h-12"
                        value={packageBooking.fromLocation}
                        onChange={(event) => setPackageBooking({ ...packageBooking, fromLocation: event.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Destination/Tour Plan</label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="e.g., Kerala, Goa, Manali"
                        className="pl-12 h-12"
                        value={packageBooking.destination}
                        onChange={(event) => setPackageBooking({ ...packageBooking, destination: event.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Start Date</label>
                      <Input type="date" className="h-12" value={packageBooking.startDate} onChange={(event) => setPackageBooking({ ...packageBooking, startDate: event.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">End Date</label>
                      <Input type="date" className="h-12" value={packageBooking.endDate} onChange={(event) => setPackageBooking({ ...packageBooking, endDate: event.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Number of Days</label>
                      <Input
                        type="number"
                        placeholder="e.g., 5"
                        className="h-12"
                        value={packageBooking.days}
                        onChange={(event) => setPackageBooking({ ...packageBooking, days: event.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Passengers</label>
                      <Input
                        type="number"
                        placeholder="e.g., 4"
                        className="h-12"
                        value={packageBooking.passengers}
                        onChange={(event) => setPackageBooking({ ...packageBooking, passengers: event.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Vehicle Type</label>
                    <select
                      className="w-full h-12 px-3 rounded-lg border border-gray-300 bg-white"
                      value={packageBooking.vehicleType}
                      onChange={(event) => setPackageBooking({ ...packageBooking, vehicleType: event.target.value })}
                    >
                      <option>Sedans</option>
                      <option>SUV / MUV</option>
                      <option>Premium</option>
                      <option>Van</option>
                      <option>Bus / Large Group</option>
                    </select>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-orange-900">Multi-Day Package</span>
                    </div>
                    <p className="text-sm text-orange-800">
                      Our packages include driver accommodation and fuel charges. Get custom quote based on your itinerary.
                    </p>
                  </div>

                  <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" onClick={handleBookPackageTaxi}>
                    <Calendar className="w-5 h-5 mr-2" />
                    Request Package Quote
                  </Button>
                </div>
              )}
            </Card>

          </div>
        </div>
      </div>

      <Dialog open={isMapPickerOpen} onOpenChange={setIsMapPickerOpen}>
        <DialogContent className="max-h-[calc(100vh-1.5rem)] max-w-4xl overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>
              Set {activePicker === "pickup" ? "Pickup" : "Drop-off"} Location
            </DialogTitle>
            <DialogDescription>
              Move the map until the center pin is on the exact spot, then confirm it.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-4">
            <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-orange-600">
                {activePicker === "pickup" ? "Pickup point" : "Drop-off point"}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {isResolvingSelection
                  ? "Finding address..."
                  : selectionAddress || "Move the map to choose the exact location."}
              </p>
            </div>

            {selectionError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {selectionError}
              </div>
            )}

            <div className="relative">
              <div ref={mapContainerRef} className="h-[50vh] min-h-[280px] max-h-[420px] w-full rounded-2xl border border-gray-200 shadow-inner" />

              {!mapReady && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80">
                  <p className="text-sm text-gray-600">Loading map...</p>
                </div>
              )}

              {mapError && (
                <div className="absolute inset-x-3 top-3 z-20 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
                  <p>{mapError}</p>
                  <Button type="button" variant="outline" className="mt-3 border-amber-300 bg-white hover:bg-amber-50" onClick={retryMapLoad}>
                    Retry map load
                  </Button>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <MapPin className="h-10 w-10 fill-orange-500 text-orange-500 drop-shadow-md" />
                  <div className="-mt-2 h-3 w-3 rounded-full bg-orange-900/20 blur-[1px]" />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                className="bg-orange-500 hover:bg-orange-600"
                onClick={confirmMapSelection}
                disabled={!selectionCoords || isResolvingSelection || isConfirmingSelection}
              >
                {isConfirmingSelection
                  ? "Setting..."
                  : `Set ${activePicker === "pickup" ? "Pickup" : "Drop-off"}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
