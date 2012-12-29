#version 330

vec4 calculateFog(in vec4 transformedEyePos, in vec4 fogColour, in float density, in vec4 col, in vec3 transformedPosition)
{
	float fFogCoord;
	vec4 vFogColour;
	vec4 waterCol;
	vec4 fogCol;
	vec4 colour;
	if (transformedPosition.y < 2.1)
	{
	
		//Add water
		fFogCoord = transformedEyePos.z;
		vFogColour = vec4(0.0, 0.0, 1.0, 1.0);
		float fDensity = 0.1;
		float fogFactor = exp(-pow(fDensity * fFogCoord, 2.0));
		fogFactor = 1.0-clamp(fogFactor, 0.0, 1.0);
		waterCol = mix(col, vFogColour, fogFactor);

		//Add fog to water
		fFogCoord = transformedEyePos.z;
		vFogColour = fogColour;
		fDensity = density;
		fogFactor = exp(-pow(fDensity * fFogCoord, 2.0));
		fogFactor = 1.0-clamp(fogFactor, 0.0, 1.0);
		fogCol = mix(col, vFogColour, fogFactor);
	}
	else 
	{
	//Add fog everywhere else
		fFogCoord = transformedEyePos.z;
		vFogColour = fogColour;
		float fDensity = density;
		float fogFactor = exp(-pow(fDensity * fFogCoord, 2.0));
		fogFactor = 1.0-clamp(fogFactor, 0.0, 1.0);
		fogCol = mix(col, vFogColour, fogFactor);
	}
	return colour = waterCol + fogCol;
}