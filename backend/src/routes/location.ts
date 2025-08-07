import express from 'express';
import axios from 'axios';
import { prisma } from '../index';
import { LocationData } from '@safehaven/shared';

const router = express.Router();

// Validate ZIP code and get location data
router.get('/validate/:zipCode', async (req, res) => {
  try {
    const { zipCode } = req.params;

    // Basic ZIP code validation
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zipCode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ZIP code format'
      });
    }

    // Check if we have a brand for this ZIP code
    const brand = await prisma.brand.findFirst({
      where: {
        isActive: true,
        zipCodes: {
          has: zipCode
        }
      }
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        error: 'No service available for this ZIP code'
      });
    }

    // Get location data from Google Maps API
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key not configured'
      });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`
    );

    if (response.data.results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'ZIP code not found'
      });
    }

    const result = response.data.results[0];
    const locationData: LocationData = {
      zipCode,
      city: '',
      state: '',
      county: '',
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      }
    };

    // Extract address components
    result.address_components.forEach((component: any) => {
      if (component.types.includes('locality')) {
        locationData.city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        locationData.state = component.short_name;
      } else if (component.types.includes('administrative_area_level_2')) {
        locationData.county = component.long_name;
      }
    });

    res.json({
      success: true,
      data: {
        location: locationData,
        brand: brand
      }
    });
  } catch (error) {
    console.error('Error validating ZIP code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate ZIP code'
    });
  }
});

// Get location by coordinates
router.get('/coordinates/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key not configured'
      });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    if (response.data.results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      });
    }

    const result = response.data.results[0];
    let zipCode = '';

    // Extract ZIP code from address components
    result.address_components.forEach((component: any) => {
      if (component.types.includes('postal_code')) {
        zipCode = component.long_name;
      }
    });

    if (!zipCode) {
      return res.status(404).json({
        success: false,
        error: 'ZIP code not found for this location'
      });
    }

    // Check if we have a brand for this ZIP code
    const brand = await prisma.brand.findFirst({
      where: {
        isActive: true,
        zipCodes: {
          has: zipCode
        }
      }
    });

    res.json({
      success: true,
      data: {
        zipCode,
        brand
      }
    });
  } catch (error) {
    console.error('Error getting location by coordinates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get location by coordinates'
    });
  }
});

export default router; 