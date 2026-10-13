import { Scene, Vector3, FreeCamera, HemisphericLight, MeshBuilder, StandardMaterial, Color3,NullEngine } from '@babylonjs/core';
import { SpriteStage } from './SpriteStage.js';

import * as BABYLON from '@babylonjs/core';
import * as LOADERS from '@babylonjs/loaders';
import HavokPhysics from "@babylonjs/havok";

import uWS from 'uWebSockets.js';

import sqlite3 from '@appthreat/sqlite3';

import * as _zstdlib from './libs/zstd/index.js';

import { PromDatabase, OPEN_READWRITE, OPEN_CREATE } from './libs/PromDatabase.mjs';

import { PromStatement } from './libs/PromStatement.mjs';



//import * as MATERIALS from '@babylonjs/materials';

//import AudioManager from './Audio.js';

//import { ShadowWaterMaterial  } from './materials/ShadowWaterMaterial.js';
//import { MultiStarSkyMaterial  } from './materials/MultiStarSkyMaterial.js';

import rumtime from "./runtime.js";
const runtime=new rumtime({isBackend:true});

const _wfile=runtime.file;

const _zstdwasm = new _wfile('./src/libs/zstd/wasm/wasm-zstd.wasm');
await _zstdwasm.load();
let _wasmBinary = await _zstdwasm.readArrayBuffer();
await _zstdlib.init({ wasmBinary:_wasmBinary });
_wasmBinary=null;
await _zstdwasm.close();
let stageWidth = 860/* Width */;
let stageHeight = 360/* Height */;

let tps=60/* tps */;

function isNode() {
  return typeof process !== 'undefined' && process.versions && typeof process.versions.node === 'string';
}

const _backend=true

// 全局变量
var mousex=0, mousey=0, mousep,mousedown=false;
// 鼠标锁定状态
let _IsPointerLock = false;
// 锁定时的累积偏移量（用于更新 mousex/mousey）
let lockOffsetX = 0;
let lockOffsetY = 0;
// 灵敏度（每像素移动对应的偏移量步长，根据需求调整）
let lockSensitivity = 1.0;

const _TextEncoder=new TextEncoder();
const _TextDecoder=new TextDecoder();

// 统一的事件处理函数



const _2d=false;
const _debug3d=false;
let _allReady=false;







function lockPointer() {
    console.log('后端模式不需要锁鼠标:)');
}

// 退出锁定
function unlockPointer() {
    console.log('后端模式不需要锁鼠标:)');
}


function pointerLockChange() {
    console.log('后端模式不需要锁鼠标:)');
}


function createStageEngine() {
    const engine = new NullEngine({ renderWidth: 1920, renderHeight: 1080 });
    return engine;
}

const engine = createStageEngine();
if (engine) {
    _allReady = true;
} else {
    console.error('create engine failed');
}


const scene = new Scene(engine);


let sceneReady = false;
scene.onReadyObservable.addOnce(() => {
    sceneReady = true;
});

// 舞台逻辑尺寸（480x360，原点在中心）


// 正交相机
const camera = new FreeCamera('camera', new Vector3(0, 0, -10), scene);
camera.rotation = new BABYLON.Vector3(0,0,0);


// 初始化精灵舞台
const stage = new SpriteStage(scene,{
    width:stageWidth,
    height:stageHeight,
    backend:true
});

stage.screenSpace=true;



















let latestRenderPool = [];
let renderPending = true;
engine.runRenderLoop(() => {
    if (!renderPending) return;
    renderPending = false;
    stage.renderTick(latestRenderPool);
    scene.render();
});






function renderf(poolx){
    latestRenderPool = poolx;
    //renderPending = true;
}
























const Math_PI=Math.PI;
const Math_sin=Math.sin;
const Math_cos=Math.cos;
const Math_tan=Math.tan;
const Math_floor=Math.floor;
const Math_abs=Math.abs;
const Math_sqrt=Math.sqrt;
const Math_ceil=Math.ceil;
const Math_round=Math.round;
const Math_log=Math.log;
const Math_exp=Math.exp;


//初始函数写这里
//等待
function* sleepms(unlockt){
    while (Date.now()<unlockt){
        yield null;
    }
}



function* waitfather(father){
    //时序已更新 下面这段注释是留档 请注意

    //为什么有两次yield?
    //第一次:yield*时执行到 避免直接统计不存在的键
    //第二次:此时刚刚把broadcasts交给eventtags 还没走到require taks的环节 所以 当前会直接返回空 也需要避免
    //其实fsum如果是undefine的话也可以避免直接结束 只是我说清楚

    //新类角色广播秒触发了 不过旧注释留档 因为旧版这个小巧思很搞笑:)
    while (true){
        //console.log(ftasks[father])
        if (ftasks[father].sum === 0){
            break;
        }
        yield null;
    }
}


function createphybody(mesh,shape,motionType,mass,pos){
    var body=new BABYLON.PhysicsBody(mesh,motionType,false,scene);
    body.shape=shape;
    body.setMassProperties({mass:mass});
    if (pos){
        body.transformNode.position=pos;
    }
    return body;
}


// 将欧拉角（弧度，ZYX顺序）写入已有的四元数 out，避免 new
function vec3ToQuaternion(vec3, out) {
    // 半角
    const hx = vec3.x * 0.5;
    const hy = vec3.y * 0.5;
    const hz = vec3.z * 0.5;
    const cx = Math.cos(hx), sx = Math.sin(hx);
    const cy = Math.cos(hy), sy = Math.sin(hy);
    const cz = Math.cos(hz), sz = Math.sin(hz);

    // ZYX 顺序：先 Z，再 X，再 Y
    out.x = sx * cy * cz + cx * sy * sz;
    out.y = cx * sy * cz - sx * cy * sz;
    out.z = cx * cy * sz + sx * sy * cz;
    out.w = cx * cy * cz - sx * sy * sz;

    return out;
}
function xyzToQuaternion(x,y,z, out) {
    // 半角
    const hx = x * 0.5;
    const hy = y * 0.5;
    const hz = z * 0.5;
    const cx = Math.cos(hx), sx = Math.sin(hx);
    const cy = Math.cos(hy), sy = Math.sin(hy);
    const cz = Math.cos(hz), sz = Math.sin(hz);

    // ZYX 顺序：先 Z，再 X，再 Y
    out.x = sx * cy * cz + cx * sy * sz;
    out.y = cx * sy * cz - sx * cy * sz;
    out.z = cx * cy * sz + sx * sy * cz;
    out.w = cx * cy * cz - sx * sy * sz;

    return out;
}

//神力传送物体
function teleportPhysicsBody(body,x,y,z) {
    body.disablePreStep = false;
    var tf=body.transformNode.position;
    tf.x=x;
    tf.y=y;
    tf.z=z;
    scene.onAfterPhysicsObservable.addOnce(() => {
        body.disablePreStep = true;
    });
}

//神力旋转物体
function rotatePhysicsBody(body,x,y,z,w) {
    body.disablePreStep = false;
    var tf=body.transformNode.rotationQuaternion;
    tf.x=x;
    tf.y=y;
    tf.z=z;
    tf.w=w;
    scene.onAfterPhysicsObservable.addOnce(() => {
        body.disablePreStep = true;
    });
}

//神力旋转物体(用vec3)
function rotatePhysicsBodyVec3(body,x,y,z) {
    body.disablePreStep = false;
    var tf=body.transformNode.rotationQuaternion;
    xyzToQuaternion(x,y,z,tf);
    scene.onAfterPhysicsObservable.addOnce(() => {
        body.disablePreStep = true;
    });
}



function computeForwardYX(rotY, rotX, distance, targetVector) {
    const cy = Math.cos(rotY);
    const sy = Math.sin(rotY);
    const cx = Math.cos(rotX);
    const sx = Math.sin(rotX);

    targetVector.x = -sy * cx * distance;
    targetVector.y = sx * distance;
    targetVector.z = cy * cx * distance;

    return targetVector;
}


/**
 * 将归一化的前向方向向量（局部Z轴在世界中的方向）转换为绕自身Y轴和X轴的弧度（Yaw, Pitch）。
 * 假设旋转顺序为 Y 后 X，忽略滚转。
 * 
 * @param {BABYLON.Vector3} direction 归一化的方向向量
 * @param {Object} outAngles 输出对象，需包含 yaw 和 pitch 属性
 * @returns {Object} outAngles 本身
 */
function directionToYawPitch(direction, outAngles) {
    const vx = direction.x;
    const vy = direction.y;
    const vz = direction.z;
    
    // pitch = arcsin(vy)，因为 vy = sin(pitch)
    const pitch = Math.asin(vy);
    
    // yaw = atan2(-vx, vz)，因为 vx = -sin(yaw)*cos(pitch), vz = cos(yaw)*cos(pitch)
    let yaw = Math.atan2(-vx, vz);
    
    outAngles.y = yaw;
    outAngles.x = pitch;
    return outAngles;
}

/**
 * 根据绕自身Y轴和X轴的弧度（Yaw, Pitch）计算归一化的前向方向向量。
 * 旋转顺序 Y 后 X。
 * 
 * @param {number} yaw 绕Y轴弧度
 * @param {number} pitch 绕X轴弧度
 * @param {BABYLON.Vector3} outVector 输出向量
 * @returns {BABYLON.Vector3} outVector
 */
function yawPitchToDirection(yaw, pitch, outVector) {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    
    outVector.x = -sy * cp;
    outVector.y = sp;
    outVector.z = cy * cp;
    
    return outVector;
}



//计时器初始化
var timerstart=Date.now()/1000;

var _answer=""