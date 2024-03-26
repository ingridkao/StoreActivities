import type { Point } from 'geojson'
export interface GeoJsonProperties {
    zo_name: string;
    do_name: string;
    city: string;
    section: string;
    address: string;
    store_id: string;
    store_name: string;
}
export interface GeoJsonFeature {
    type: "Feature";
    geometry: Point;
    properties: GeoJsonProperties;
}
export interface GeoJsonFeatureCollection {
    type: "FeatureCollection";
    features: GeoJsonFeature[];
}

export interface LatLngType {
	lat?: number;
	lng?: number;
}
export interface TargetBoxDataType {
	store_id?: string;
	store_name?: string;
	zo_name?: string;
	address?: string;
}
