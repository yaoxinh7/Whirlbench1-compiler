import { Engine, WebGPUEngine, Scene, Vector3, FreeCamera, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { SpriteStage } from './SpriteStage.js';

import * as BABYLON from '@babylonjs/core';
import * as LOADERS from '@babylonjs/loaders';
import * as MATERIALS from '@babylonjs/materials';
import HavokPhysics from "@babylonjs/havok";
import AudioManager from './Audio.js';

import { ShadowWaterMaterial  } from './materials/ShadowWaterMaterial.js';
import { MultiStarSkyMaterial  } from './materials/MultiStarSkyMaterial.js';

import * as _zstdlib from './libs/zstd/index.js';
import _zstdWasmUrl from './libs/zstd/wasm/wasm-zstd.wasm?url';

await _zstdlib.init({ _zstdWasmUrl });

import rumtime from "./runtime.js";
const runtime=new rumtime({isBackend:false});

let stageWidth = 860/* Width */;
let stageHeight = 360/* Height */;

let tps=60/* tps */;

const _backend=false;

function isNode() {
  return typeof process !== 'undefined' && process.versions && typeof process.versions.node === 'string';
}

if (typeof window !== 'undefined' && window.nw && window.nw.Window) {
    nw.Window.get().on('loaded', function() {
        // 定义一个 Alt+Enter 的全局快捷键
        var shortcut = new nw.Shortcut({
            key: "Alt+Enter",
            active: function() {
                // 执行全屏切换
                nw.Window.get().toggleFullscreen();
            },
            failed: function(msg) {
                console.log("快捷键注册失败: " + msg);
            }
        });
        // 注册这个快捷键
        nw.App.registerGlobalHotKey(shortcut);
        console.log("准备就绪 启动!")
        if (ticker){
            
            ticker.start();
        }
    });
}






// 全局变量
var mousex=0, mousey=0, mousep,mousedown;
// 鼠标锁定状态
let _IsPointerLock = false;
// 锁定时的累积偏移量（用于更新 mousex/mousey）
let lockOffsetX = 0;
let lockOffsetY = 0;
// 灵敏度（每像素移动对应的偏移量步长，根据需求调整）
let lockSensitivity = 1.0;
// 统一的事件处理函数



const _2d=false;
const _debug3d=false;
let _allReady=false;




if (_debug3d){
    var canvas = document.getElementById('overlayCanvas');
}else{
    var canvas = document.getElementById('renderCanvas');
}
//const canvas = document.getElementById('overlayCanvas');
const ovrcanvas = document.getElementById('overlayCanvas');




const stageInputMetrics = {
    left: 0,
    top: 0,
    scaleX: 1,
    scaleY: 1,
    xScale: 1,
    yScale: 1
};
function updateStageInputMetrics() {
    const rect = ovrcanvas.getBoundingClientRect();
    const rectWidth = Math.max(1, rect.width || 1);
    const rectHeight = Math.max(1, rect.height || 1);
    const canvasWidth = Math.max(1, canvas.width || 1);
    const canvasHeight = Math.max(1, canvas.height || 1);
    stageInputMetrics.left = rect.left;
    stageInputMetrics.top = rect.top;
    stageInputMetrics.scaleX = canvasWidth / rectWidth;
    stageInputMetrics.scaleY = canvasHeight / rectHeight;
    stageInputMetrics.xScale = stageHeight / canvasWidth;
    stageInputMetrics.yScale = stageWidth / canvasHeight;
}
function getPointerClientXY(event) {
    if (event && typeof event.clientX === "number" && typeof event.clientY === "number") {
        return [event.clientX, event.clientY];
    }
    if (event && event.touches && event.touches[0]) {
        return [event.touches[0].clientX, event.touches[0].clientY];
    }
    if (event && event.changedTouches && event.changedTouches[0]) {
        return [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
    }
    return [stageInputMetrics.left, stageInputMetrics.top];
}
// 获取舞台坐标的函数（你已定义，保持不变）
function getStageCoordinates(canvas, event) {
    // 获取 overlayCanvas 当前 CSS 布局位置
    const rect = ovrcanvas.getBoundingClientRect();
    const rectWidth = Math.max(1, rect.width);
    const rectHeight = Math.max(1, rect.height);

    // 获取 renderCanvas 当前像素尺寸（由 Babylon 引擎动态设置）
    const canvasWidth = Math.max(1, canvas.width);
    const canvasHeight = Math.max(1, canvas.height);

    const [clientX, clientY] = getPointerClientXY(event);

    // CSS 坐标相对于 overlayCanvas 左上角
    const cssX = clientX - rect.left;
    const cssY = clientY - rect.top;

    // 转换为 renderCanvas 像素坐标
    const pixelX = cssX * (canvasWidth / rectWidth);
    const pixelY = cssY * (canvasHeight / rectHeight);

    // 映射到舞台逻辑坐标（原点在中心，舞台尺寸 480×360）
    const stageX = (pixelX - canvasWidth / 2) * (stageWidth / canvasWidth);
    const stageY = -(pixelY - canvasHeight / 2) * (stageHeight / canvasHeight);

    return [stageX, stageY];
}


function handleMouseEvent(e) {
    // 锁定状态：不再计算舞台坐标，只累积偏移量
    if (_IsPointerLock) {
        // 获取移动增量（Pointer Lock API 提供 movementX/movementY）
        let movX = 0, movY = 0;
        // ... 获取 movement 值的代码保持不变 ...
        movX = e.movementX ?? e.mozMovementX ?? e.webkitMovementX ?? 0;
        movY = e.movementY ?? e.mozMovementY ?? e.webkitMovementY ?? 0;

        // 直接输出增量（乘以灵敏度）
        mousex = movX * lockSensitivity;
        mousey = - movY * lockSensitivity;

        // 更新 mousedown 标志（锁定期间依然需要知道按键状态）
        if (e.type === 'pointerdown' || e.type === 'mousedown' || e.type === 'touchstart') {
            mousedown = true;
        } else if (e.type === 'pointerup' || e.type === 'mouseup' || e.type === 'touchend' || e.type === 'touchcancel') {
            mousedown = false;
        } else if (e.type === 'pointermove' || e.type === 'mousemove' || e.type === 'touchmove') {
            if (e.buttons !== undefined) {
                mousedown = (e.buttons & 1) === 1;
            } else if (e.touches) {
                mousedown = e.touches.length > 0;
            }
        }
        return; // 锁定模式下不再执行下方的舞台坐标计算
    }
    mousep = getStageCoordinates(canvas, e);
    mousex = mousep[0];
    mousey = mousep[1];
    // 可选：打印坐标
    //console.log(`舞台坐标: (${mousex.toFixed(2)}, ${mousey.toFixed(2)})`);
    if (e.type === 'pointerdown' || e.type === 'mousedown' || e.type === 'touchstart') {
        mousedown = true;
    }
    // 移动事件中检查实际触点
    else if (e.type === 'pointermove' || e.type === 'mousemove' || e.type === 'touchmove') {
        if (e.buttons !== undefined) {
            mousedown = (e.buttons & 1) === 1;
        } else if (e.touches) {
            mousedown = e.touches.length > 0;
        }
    }else{
        mousedown = false;
    }
    //console.log(mousedown);
}
updateStageInputMetrics();



// 窗口自适应（保持物理像素与显示尺寸匹配）
const stageRatio = stageWidth / stageHeight;

function resizeCanvas() {
    const container = document.getElementById('canvas-container');
    const renderCanvas = document.getElementById('renderCanvas');
    const overlayCanvas = document.getElementById('overlayCanvas');

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    if (containerWidth && containerHeight) {
        let drawWidth, drawHeight;
        const stageRatio = stageWidth/stageHeight; // 或者用已有的 stageWidth/stageHeight

        // 保持比例的尺寸计算（与原逻辑相同）
        const heightFromWidth = containerWidth / stageRatio;
        if (heightFromWidth <= containerHeight) {
            drawWidth = containerWidth;
            drawHeight = heightFromWidth;
        } else {
            drawHeight = containerHeight;
            drawWidth = containerHeight * stageRatio;
        }

        // 设置两个 canvas 的 CSS 尺寸
        renderCanvas.style.width = drawWidth + 'px';
        renderCanvas.style.height = drawHeight + 'px';
        overlayCanvas.style.width = drawWidth + 'px';
        overlayCanvas.style.height = drawHeight + 'px';

        // 设置物理像素尺寸（使用 devicePixelRatio 保证清晰）
        const dpr = window.devicePixelRatio || 1;
        renderCanvas.width = drawWidth * dpr;
        renderCanvas.height = drawHeight * dpr;
        overlayCanvas.width = drawWidth * dpr;
        overlayCanvas.height = drawHeight * dpr;
        if (typeof updateStageInputMetrics === "function") {
            updateStageInputMetrics();
        }
    }
    if (!_allReady) return;
    if (engine) engine.resize();
    renderPending = true;
}




function lockPointer() {
    if (!ovrcanvas.requestPointerLock) {
        console.warn("Pointer Lock API 不支持");
        return;
    }
    // 重置偏移量累积值
    lockOffsetX = 0;
    lockOffsetY = 0;
    ovrcanvas.requestPointerLock();
}

// 退出锁定
function unlockPointer() {
    if (document.exitPointerLock) {
        document.exitPointerLock();
    }
}


function pointerLockChange() {
    const isLocked = (document.pointerLockElement === ovrcanvas);
    _IsPointerLock = isLocked;

    if (isLocked) {
        // 锁定成功：隐藏光标
        ovrcanvas.style.cursor = 'none';
        // 可选：禁用原有的 Babylon 相机控制（如果你需要用手动偏移控制，可以在这里 detachControl）
        // camera.detachControl(ovrcanvas);
    } else {
        // 解锁：恢复光标
        ovrcanvas.style.cursor = 'default';
        // 恢复相机控制（如果之前 detach 了）
        // camera.attachControl(ovrcanvas, true);
    }
}

//鼠标指针锁的监听
document.addEventListener('pointerlockchange', pointerLockChange);
document.addEventListener('mozpointerlockchange', pointerLockChange);
document.addEventListener('webkitpointerlockchange', pointerLockChange);

// 阻止触摸事件的默认行为（滚动、缩放、长按菜单）
ovrcanvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
ovrcanvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
ovrcanvas.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
ovrcanvas.addEventListener('touchcancel', (e) => e.preventDefault(), { passive: false });

// 专门阻止长按上下文菜单
ovrcanvas.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
window.addEventListener("scroll", updateStageInputMetrics, { passive: true });
if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateStageInputMetrics, { passive: true });
    window.visualViewport.addEventListener("scroll", updateStageInputMetrics, { passive: true });
}
if (window.PointerEvent) {
    ovrcanvas.addEventListener('pointermove', handleMouseEvent, { passive: true });
    ovrcanvas.addEventListener('pointerdown', handleMouseEvent, { passive: true });
    ovrcanvas.addEventListener('pointerup', handleMouseEvent, { passive: true });
} else {
    ovrcanvas.addEventListener('mousemove', handleMouseEvent, { passive: true });
    ovrcanvas.addEventListener('mousedown', handleMouseEvent, { passive: true });
    ovrcanvas.addEventListener('mouseup', handleMouseEvent, { passive: true });
    ovrcanvas.addEventListener('touchstart', handleMouseEvent, { passive: true });
    ovrcanvas.addEventListener('touchmove', handleMouseEvent, { passive: true });
    ovrcanvas.addEventListener('touchcancel', handleMouseEvent, { passive: true });
    console.log(222);
}
ovrcanvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});


async function createStageEngine(targetCanvas) {
    try {
        if (await WebGPUEngine.IsSupportedAsync) {
            const nextEngine = new WebGPUEngine(targetCanvas, {
                antialiasing: false
            });
            const twgslBasePath = './runtime/';
            await nextEngine.initAsync(
                null, // 如果你也需要 glslang，这里可以传 glslangOptions
                {
                    jsPath: `${twgslBasePath}twgsl.js`,
                    wasmPath: `${twgslBasePath}twgsl.wasm`
                });
            return nextEngine;
        }
    } catch (error) {
        console.warn("WebGPU init failed, fallback to WebGL2", error);
    }
    return new Engine(targetCanvas, false);
}
const engine = await createStageEngine(canvas);

if (engine){
    _allReady=true;
}else{
    console.error('create engine faild');
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
if (_2d){
    camera.position=new Vector3(0, 0, -10);
    camera.mode = FreeCamera.ORTHOGRAPHIC_CAMERA;
    camera.orthoLeft = -stageWidth / 2;
    camera.orthoRight = stageWidth / 2;
    camera.orthoBottom = -stageHeight / 2;
    camera.orthoTop = stageHeight / 2;
    const light = new HemisphericLight('light', new Vector3(1, 1, 1), scene); // 光源放在上方
    light.intensity = 5;
    const ground = MeshBuilder.CreatePlane('ground', { width: stageWidth, height: stageHeight }, scene);
    ground.position.z = 2; // 放在精灵后面
    const groundMaterial = new StandardMaterial('groundMat', scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2); // 深灰色背景
    ground.material = groundMaterial;
}else{
    camera.position=new Vector3(0, 0, -10);
    camera.setTarget(Vector3.Zero()); // 看向原点
    camera.attachControl(ovrcanvas, true);
    camera.angularSensibility = 800;   // 降低旋转灵敏度
    camera.panningSensibility = 800;
    camera.wheelPrecision = 30;
    camera.speed = 10;
    camera.inertia = 0.8;
    camera.fov=Math.PI/2;

    // 限制相机范围
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 30;
// 1. 设置键盘映射（WASD + Space/Shift）
    camera.keysUp = [87];        // W
    camera.keysDown = [83];      // S
    camera.keysLeft = [65];      // A
    camera.keysRight = [68];     // D
    camera.keysUpward = [32];    // Space（键码32）
    camera.keysDownward = [16];  // Shift（键码16，左右Shift都生效）
    camera.minZ = 0.05;

    //const redBox = MeshBuilder.CreateBox('redBox', { size: 2 }, scene);
    //redBox.position = Vector3.Zero();

    // 创建红色材质
    //const redMaterial = new StandardMaterial('redMat', scene);
    //redMaterial.diffuseColor = new Color3(1, 0, 0);  // 漫反射红色
    ///redMaterial.emissiveColor = new Color3(0.5, 0, 0); // 自发光增强效果
    //redBox.material = redMaterial;

    // 可选：添加边缘高亮或轮廓线
    //redMaterial.specularColor = new Color3(0.8, 0.2, 0.2); // 红色高光
    
}



//控制
//camera.attachControl(canvas, true);
//取消控制
//camera.detachControl(canvas);
// 光源（方向设为0,0,0消除白线）




// 添加背景地面（位于精灵后方）


// 初始化精灵舞台
const stage = new SpriteStage(scene,{
    width:stageWidth,
    height:stageHeight,
    backend:false
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
    renderPending = true;
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