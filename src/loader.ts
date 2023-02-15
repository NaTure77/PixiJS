import { Assets } from 'pixi.js';
import asset_option from './json/asset.json'

export let a = 10

// 비동기로 에셋을 불러옴.
export async function load_all() {
    //에셋 로드
    await Assets.init({ manifest: asset_option });
    await Assets.loadBundle('test-screen');
    // let loadScreenAssets = await Assets.loadBundle('load-screen');
    // let gameScreenAssets = await Assets.loadBundle('game-screen')
}