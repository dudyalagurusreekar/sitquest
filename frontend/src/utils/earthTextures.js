import * as THREE from 'three';

const loader = new THREE.TextureLoader();

/**
 * Loads high-resolution 2K NASA Blue Marble satellite textures from /textures/
 * for realistic terrain relief, specular ocean reflections, clouds, and night lights.
 */
export function loadSatelliteEarthTextures(renderer) {
  const maxAniso = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;

  const configure = (tex, isSRGB = false) => {
    if (isSRGB) {
      tex.colorSpace = THREE.SRGBColorSpace;
    }
    tex.anisotropy = maxAniso;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  };

  const dayMap = configure(loader.load('/textures/earth_day.jpg'), true);
  const normalMap = configure(loader.load('/textures/earth_normal.jpg'), false);
  const specularMap = configure(loader.load('/textures/earth_specular.jpg'), false);
  const cloudMap = configure(loader.load('/textures/earth_clouds.png'), true);
  const lightsMap = configure(loader.load('/textures/earth_lights.png'), true);

  return { dayMap, normalMap, specularMap, cloudMap, lightsMap };
}
