#version 330

uniform mat4 model;
uniform mat4 modelViewProjection;
uniform mat4 modelInverseTranspose;
uniform mat4 scale;
uniform vec4 fogCol;

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texCoordIn;

out vec3 transformedPosition;
smooth out vec3 transformedNormal;
out vec2 texCoordOut;
out vec4 transformedEyePos;
out vec4 fogColour;

void main()
{
	gl_Position = modelViewProjection * vec4(position, 1.0);
	transformedPosition = (model * vec4(position, 1.0)).xyz;
	transformedNormal = normalize((modelInverseTranspose * vec4(normal, 0.0)).xyz);
	texCoordOut = (scale * vec4(texCoordIn, 0.0, 0.0)).xy;

	transformedEyePos = modelViewProjection * vec4(position, 1.0);
	fogColour = fogCol;
}