#version 330

layout (std140) uniform;

#define MAX_LIGHTS 10

#ifndef MATERIAL
#define MATERIAL
struct MaterialData
{
	vec4 emissive;
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	float shininess;
};
#endif

uniform Material
{
	MaterialData material;
};

uniform sampler2D tex;

#ifndef POINT_LIGHT
#define POINT_LIGHT
struct PointLight
{
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	vec4 lightPos;
	vec4 attenuation;
	float dist;
};
#endif

#ifndef SPOT_LIGHT
#define SPOT_LIGHT
struct SpotLight
{
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	vec4 lightPos;
	vec4 attenuation;
	vec4 lightDir;
	float power;
	float dist;
};
#endif

uniform DynamicLights
{
	PointLight points[MAX_LIGHTS];
	SpotLight spots[MAX_LIGHTS];
} dynamic;

uniform int numPoints;
uniform int numSpots;

uniform vec3 eyePos;
uniform float density;
uniform float fogOn;

in vec3 transformedPosition;
in vec3 transformedNormal;
in vec2 texCoordOut;
in vec4 transformedEyePos;
in vec4 fogColour;

out vec4 colour;

vec4 calculateLighting(in MaterialData material, in vec3 toEye, in vec3 transformedNormal);

vec4 calculatePoint(in MaterialData material, in vec3 toEye, in PointLight point, in vec3 transformedPosition, in vec3 transformedNormal);

vec4 calculateSpot(in MaterialData material, in vec3 toEye, in SpotLight spot, in vec3 transformedPosition, in vec3 transformedNormal);

vec4 calculateFog(in vec4 transformedEyePos, in vec4 fogColour, in float density, in vec4 col, in vec3 transformedPosition);

void main()
{
	vec3 toEye = normalize(eyePos - transformedPosition);

	vec4 col = calculateLighting(material, toEye, transformedNormal);

	for (int i = 0; i < numPoints; ++i)
		col += calculatePoint(material, toEye, dynamic.points[i], transformedPosition, transformedNormal);

	for (int i = 0; i < numSpots; ++i)
		col += calculateSpot(material, toEye, dynamic.spots[i], transformedPosition, transformedNormal);

	col *= texture2D(tex, texCoordOut);

	col += material.emissive;

	if (fogOn == 1.0)
	{
		colour = calculateFog(transformedEyePos, fogColour, density, col, transformedPosition);
	}
	else
		colour = col;
	
	//float fFogCoord;
	//vec4 vFogColour;
	//vec4 waterCol;
	//vec4 fogCol;
	//if (transformedPosition.y < 2.1)
	//{
	
	//	//Add water
	//	fFogCoord = transformedEyePos.z;
	//	vFogColour = vec4(0.0, 0.0, 1.0, 1.0);
	//	//vFogColour = fogColour;
	//	float fDensity = 0.1;
	//	//float fDensity = density;
	//	float fogFactor = exp(-pow(fDensity * fFogCoord, 2.0));
	//	fogFactor = 1.0-clamp(fogFactor, 0.0, 1.0);
	//	waterCol = mix(col, vFogColour, fogFactor);

	//	fFogCoord = transformedEyePos.z;
	//	//vFogColour = vec4(0.7, 0.7, 0.7, 1.0);
	//	vFogColour = fogColour;
	//	fDensity = density;
	//	//fDensity = 0.03;
	//	fogFactor = exp(-pow(fDensity * fFogCoord, 2.0));
	//	fogFactor = 1.0-clamp(fogFactor, 0.0, 1.0);
	//	fogCol = mix(col, vFogColour, fogFactor);
	//}
	//else 
	//{
	//	colour = col;
	//	fFogCoord = transformedEyePos.z;
	//	//vFogColour = vec4(0.7, 0.7, 0.7, 1.0);
	//	vFogColour = fogColour;
	//	float fDensity = density;
	//	 //float fDensity = 0.0;
	//	float fogFactor = exp(-pow(fDensity * fFogCoord, 2.0));
	//	fogFactor = 1.0-clamp(fogFactor, 0.0, 1.0);
	//	fogCol = mix(col, vFogColour, fogFactor);
	//	//colour = mix(col, vFogColour, fogFactor);
	//}
	//colour = waterCol + fogCol;
		
}