/*
	Implementation based on:

// Author: Arnold Andreasson, info@mellifica.se
// Copyright (c) 2007-2013 Arnold Andreasson 
// License: MIT License as follows:
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// =============================================================================
// Javascript-implementation of "Gauss Conformal Projection 
// (Transverse Mercator), Krügers Formulas".
// - Parameters for SWEREF99 lat-long to/from RT90 and SWEREF99 
//   coordinates (RT90 and SWEREF99 are used in Swedish maps).
// Source: http://www.lantmateriet.se/geodesi/

*/
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for working with angles.
 */
dbm.registerClass("dbm.utils.math.mapprojection.SwedishRt90Converter", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.math.mapprojection.SwedishRt90Converter");
	//"use strict";
	
	//Self reference
	var SwedishRt90Converter = dbm.importClass("dbm.utils.math.mapprojection.SwedishRt90Converter");
	
	//Utils
	var AngleFunctions = dbm.importClass("dbm.utils.math.AngleFunctions");
	
	staticFunctions.convertRt90ToLatLong = function(aRt90Point, aReturnPoint) {
		var axis = 6378137.0;
		var flattening = 1.0 / 298.257222101;
		var centralMeridian = 15.0 + 48.0/60.0 + 22.624306/3600.0;
		var scale = 1.00000561024;
		var falseNorthing = -667.711;
		var falseEasting = 1500064.274;
		
		ClassReference._calculateLatLong(aRt90Point, axis, flattening, centralMeridian, scale, falseNorthing, falseEasting, aReturnPoint);
	};
	
	staticFunctions.convertLatLongToRt90 = function(aLatLongPoint, aReturnPoint) {
		var axis = 6378137.0;
		var flattening = 1.0 / 298.257222101;
		var centralMeridian = 15.0 + 48.0/60.0 + 22.624306/3600.0;
		var scale = 1.00000561024;
		var falseNorthing = -667.711;
		var falseEasting = 1500064.274;
		
		ClassReference._calculateRt90(aLatLongPoint, axis, flattening, centralMeridian, scale, falseNorthing, falseEasting, aReturnPoint);
	};
	
	staticFunctions._calculateLatLong = function(aRt90Point, aAxis, aFlattening, aCentralMeridian, aScale, aFalseNorthing, aFalseEasting, aReturnPoint) {
		// Prepare ellipsoid-based stuff.
		var e2 = aFlattening * (2.0 - aFlattening);
		var n = aFlattening / (2.0 - aFlattening);
		var a_roof = aAxis / (1.0 + n) * (1.0 + n*n/4.0 + n*n*n*n/64.0);
		var delta1 = n/2.0 - 2.0*n*n/3.0 + 37.0*n*n*n/96.0 - n*n*n*n/360.0;
		var delta2 = n*n/48.0 + n*n*n/15.0 - 437.0*n*n*n*n/1440.0;
		var delta3 = 17.0*n*n*n/480.0 - 37*n*n*n*n/840.0;
		var delta4 = 4397.0*n*n*n*n/161280.0;

		var Astar = e2 + e2*e2 + e2*e2*e2 + e2*e2*e2*e2;
		var Bstar = -(7.0*e2*e2 + 17.0*e2*e2*e2 + 30.0*e2*e2*e2*e2) / 6.0;
		var Cstar = (224.0*e2*e2*e2 + 889.0*e2*e2*e2*e2) / 120.0;
		var Dstar = -(4279.0*e2*e2*e2*e2) / 1260.0;

		// Convert.
		var deg_to_rad = Math.PI / 180;
		var lambda_zero = aCentralMeridian * deg_to_rad;
		var xi = (aRt90Point.x - aFalseNorthing) / (aScale * a_roof);		
		var eta = (aRt90Point.y - aFalseEasting) / (aScale * a_roof);
		var xi_prim = xi - 
						delta1*Math.sin(2.0*xi) * AngleFunctions.cosh(2.0*eta) - 
						delta2*Math.sin(4.0*xi) * AngleFunctions.cosh(4.0*eta) - 
						delta3*Math.sin(6.0*xi) * AngleFunctions.cosh(6.0*eta) - 
						delta4*Math.sin(8.0*xi) * AngleFunctions.cosh(8.0*eta);
		var eta_prim = eta - 
						delta1*Math.cos(2.0*xi) * AngleFunctions.sinh(2.0*eta) - 
						delta2*Math.cos(4.0*xi) * AngleFunctions.sinh(4.0*eta) - 
						delta3*Math.cos(6.0*xi) * AngleFunctions.sinh(6.0*eta) - 
						delta4*Math.cos(8.0*xi) * AngleFunctions.sinh(8.0*eta);
		var phi_star = Math.asin(Math.sin(xi_prim) / AngleFunctions.cosh(eta_prim));
		var delta_lambda = Math.atan(AngleFunctions.sinh(eta_prim) / Math.cos(xi_prim));
		var lon_radian = lambda_zero + delta_lambda;
		var lat_radian = phi_star + Math.sin(phi_star) * Math.cos(phi_star) * 
						(Astar + 
						 Bstar*Math.pow(Math.sin(phi_star), 2) + 
						 Cstar*Math.pow(Math.sin(phi_star), 4) + 
						 Dstar*Math.pow(Math.sin(phi_star), 6));  	
		aReturnPoint.x = lat_radian * 180.0 / Math.PI;
		aReturnPoint.y = lon_radian * 180.0 / Math.PI;
	};
	
	staticFunctions._calculateRt90 = function(aLatLongPoint, aAxis, aFlattening, aCentralMeridian, aScale, aFalseNorthing, aFalseEasting, aReturnPoint) {
		
		// Prepare ellipsoid-based stuff.
		var e2 = aFlattening * (2.0 - aFlattening);
		var n = aFlattening / (2.0 - aFlattening);
		var a_roof = aAxis / (1.0 + n) * (1.0 + n*n/4.0 + n*n*n*n/64.0);
		var A = e2;
		var B = (5.0*e2*e2 - e2*e2*e2) / 6.0;
		var C = (104.0*e2*e2*e2 - 45.0*e2*e2*e2*e2) / 120.0;
		var D = (1237.0*e2*e2*e2*e2) / 1260.0;
		var beta1 = n/2.0 - 2.0*n*n/3.0 + 5.0*n*n*n/16.0 + 41.0*n*n*n*n/180.0;
		var beta2 = 13.0*n*n/48.0 - 3.0*n*n*n/5.0 + 557.0*n*n*n*n/1440.0;
		var beta3 = 61.0*n*n*n/240.0 - 103.0*n*n*n*n/140.0;
		var beta4 = 49561.0*n*n*n*n/161280.0;
	
		// Convert.
		var deg_to_rad = Math.PI / 180.0;
		var phi = aLatLongPoint.x * deg_to_rad;
		var lambda = aLatLongPoint.y * deg_to_rad;
		var lambda_zero = aCentralMeridian * deg_to_rad;
	
		var phi_star = phi - Math.sin(phi) * Math.cos(phi) * (A + 
						B*Math.pow(Math.sin(phi), 2) + 
						C*Math.pow(Math.sin(phi), 4) + 
						D*Math.pow(Math.sin(phi), 6));
		var delta_lambda = lambda - lambda_zero;
		var xi_prim = Math.atan(Math.tan(phi_star) / Math.cos(delta_lambda));
		var eta_prim = AngleFunctions.atanh(Math.cos(phi_star) * Math.sin(delta_lambda));
		var x = aScale * a_roof * (xi_prim +
						beta1 * Math.sin(2.0*xi_prim) * AngleFunctions.cosh(2.0*eta_prim) +
						beta2 * Math.sin(4.0*xi_prim) * AngleFunctions.cosh(4.0*eta_prim) +
						beta3 * Math.sin(6.0*xi_prim) * AngleFunctions.cosh(6.0*eta_prim) +
						beta4 * Math.sin(8.0*xi_prim) * AngleFunctions.cosh(8.0*eta_prim)) + 
						aFalseNorthing;
		var y = aScale * a_roof * (eta_prim +
						beta1 * Math.cos(2.0*xi_prim) * AngleFunctions.sinh(2.0*eta_prim) +
						beta2 * Math.cos(4.0*xi_prim) * AngleFunctions.sinh(4.0*eta_prim) +
						beta3 * Math.cos(6.0*xi_prim) * AngleFunctions.sinh(6.0*eta_prim) +
						beta4 * Math.cos(8.0*xi_prim) * AngleFunctions.sinh(8.0*eta_prim)) + 
						aFalseEasting;
		aReturnPoint.x = Math.round(x * 1000.0) / 1000.0;
		aReturnPoint.y = Math.round(y * 1000.0) / 1000.0;
	};
});