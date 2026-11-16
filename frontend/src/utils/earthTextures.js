import * as THREE from 'three';

const publicAsset = (path) => `${import.meta.env.BASE_URL}${String(path || '').replace(/^\/+/, '')}`;

const TEXTURE_PATHS = {
  dayMap: publicAsset('textures/earth_day.jpg'),
  normalMap: publicAsset('textures/earth_normal.jpg'),
  specularMap: publicAsset('textures/earth_specular.jpg'),
  cloudMap: publicAsset('textures/earth_clouds.png'),
  lightsMap: publicAsset('textures/earth_lights.png'),
};

const imageCache = {};
const loader = new THREE.TextureLoader();

function loadCachedTexture(url, renderer, isSRGB) {
  const maxAniso = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;

  if (imageCache[url]?.complete && imageCache[url].naturalWidth > 0) {
    const tex = new THREE.Texture(imageCache[url]);
    if (isSRGB) tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAniso;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }

  const tex = loader.load(url, (loaded) => {
    if (loaded.image) {
      imageCache[url] = loaded.image;
    }
  });
  if (isSRGB) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * Loads high-resolution 2K NASA Blue Marble satellite textures from /textures/
 * using cached decoded images so Loader and Home globes initialize instantaneously.
 */
export function loadSatelliteEarthTextures(renderer) {
  return {
    dayMap: loadCachedTexture(TEXTURE_PATHS.dayMap, renderer, true),
    normalMap: loadCachedTexture(TEXTURE_PATHS.normalMap, renderer, false),
    specularMap: loadCachedTexture(TEXTURE_PATHS.specularMap, renderer, false),
    cloudMap: loadCachedTexture(TEXTURE_PATHS.cloudMap, renderer, true),
    lightsMap: loadCachedTexture(TEXTURE_PATHS.lightsMap, renderer, true),
  };
}
