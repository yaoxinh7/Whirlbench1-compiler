function tonotstr(str) {
    if (typeof str === 'string' && str.startsWith('"') && str.endsWith('"')) {
        return str.slice(1, -1).replaceAll("\\\"", "\"");
    }
    return str;
}

class Types {
    constructor() {
        this.Number = 1;
        this.String = 2;
        this.Any = 3;
        this.Empty = 4;
        this.Object = 5;
    }
}

function genarg(key, type, isinput = false) {
    return {
        key: key,
        expectType: type,
        isinput: isinput
    };
}

const Type = new Types();

class ext {
    reporter(opcode) {
        switch (opcode) {
            // ---------- 菜单 Reporter ----------
            case 'babylonjscamera_menu_COMMON_PROPS':
                return {
                    js: function(args) {
                        return { v: `${args.COMMON_PROPS}`, t: Type.String };
                    },
                    args: [
                        genarg("COMMON_PROPS", Type.Any, false)
                    ]
                };
            case 'babylonjscamera_menu_ARC_PROPS':
                return {
                    js: function(args) {
                        return { v: `${args.ARC_PROPS}`, t: Type.String };
                    },
                    args: [
                        genarg("ARC_PROPS", Type.Any, false)
                    ]
                };
            case 'babylonjscamera_menu_FOLLOW_PROPS':
                return {
                    js: function(args) {
                        return { v: `${args.FOLLOW_PROPS}`, t: Type.String };
                    },
                    args: [
                        genarg("FOLLOW_PROPS", Type.Any, false)
                    ]
                };
            case 'babylonjscamera_menu_FLY_PROPS':
                return {
                    js: function(args) {
                        return { v: `${args.FLY_PROPS}`, t: Type.String };
                    },
                    args: [
                        genarg("FLY_PROPS", Type.Any, false)
                    ]
                };
            case 'babylonjscamera_menu_JOY_PROPS':
                return {
                    js: function(args) {
                        return { v: `${args.JOY_PROPS}`, t: Type.String };
                    },
                    args: [
                        genarg("JOY_PROPS", Type.Any, false)
                    ]
                };

            // ---------- 创建相机 ----------
            case 'babylonjscamera_bjs_create_universal_camera':
                return {
                    js: function(args) {
                        return {
                            v: `(new BABYLON.UniversalCamera(${tonotstr(args.NAME.v)}, new BABYLON.Vector3(${args.X.v}, ${args.Y.v}, ${args.Z.v}), scene))`,
                            t: Type.Object
                        };
                    },
                    args: [
                        genarg("NAME", Type.String, true),
                        genarg("X", Type.Number, true),
                        genarg("Y", Type.Number, true),
                        genarg("Z", Type.Number, true)
                    ]
                };
            case 'babylonjscamera_bjs_create_arc_camera':
                return {
                    js: function(args) {
                        return {
                            v: `(new BABYLON.ArcRotateCamera(${tonotstr(args.NAME.v)}, ${args.A.v}, ${args.B.v}, ${args.R.v}, new BABYLON.Vector3(${args.TX.v}, ${args.TY.v}, ${args.TZ.v}), scene))`,
                            t: Type.Object
                        };
                    },
                    args: [
                        genarg("NAME", Type.String, true),
                        genarg("R", Type.Number, true),
                        genarg("A", Type.Number, true),
                        genarg("B", Type.Number, true),
                        genarg("TX", Type.Number, true),
                        genarg("TY", Type.Number, true),
                        genarg("TZ", Type.Number, true)
                    ]
                };
            case 'babylonjscamera_bjs_create_follow_camera':
                return {
                    js: function(args) {
                        return {
                            v: `(new BABYLON.FollowCamera(${tonotstr(args.NAME.v)}, new BABYLON.Vector3(${args.X.v}, ${args.Y.v}, ${args.Z.v}), scene))`,
                            t: Type.Object
                        };
                    },
                    args: [
                        genarg("NAME", Type.String, true),
                        genarg("X", Type.Number, true),
                        genarg("Y", Type.Number, true),
                        genarg("Z", Type.Number, true)
                    ]
                };
            case 'babylonjscamera_bjs_create_fly_camera':
                return {
                    js: function(args) {
                        return {
                            v: `(new BABYLON.FlyCamera(${tonotstr(args.NAME.v)}, new BABYLON.Vector3(${args.X.v}, ${args.Y.v}, ${args.Z.v}), scene))`,
                            t: Type.Object
                        };
                    },
                    args: [
                        genarg("NAME", Type.String, true),
                        genarg("X", Type.Number, true),
                        genarg("Y", Type.Number, true),
                        genarg("Z", Type.Number, true)
                    ]
                };
            case 'babylonjscamera_bjs_create_device_camera':
                return {
                    js: function(args) {
                        return {
                            v: `(new BABYLON.DeviceOrientationCamera(${tonotstr(args.NAME.v)}, new BABYLON.Vector3(${args.X.v}, ${args.Y.v}, ${args.Z.v}), scene))`,
                            t: Type.Object
                        };
                    },
                    args: [
                        genarg("NAME", Type.String, true),
                        genarg("X", Type.Number, true),
                        genarg("Y", Type.Number, true),
                        genarg("Z", Type.Number, true)
                    ]
                };
            case 'babylonjscamera_bjs_create_joystick_camera':
                return {
                    js: function(args) {
                        return {
                            v: `(new BABYLON.VirtualJoysticksCamera(${tonotstr(args.NAME.v)}, new BABYLON.Vector3(${args.X.v}, ${args.Y.v}, ${args.Z.v}), scene))`,
                            t: Type.Object
                        };
                    },
                    args: [
                        genarg("NAME", Type.String, true),
                        genarg("X", Type.Number, true),
                        genarg("Y", Type.Number, true),
                        genarg("Z", Type.Number, true)
                    ]
                };
            case 'babylonjscamera_bjs_create_anaglyph_camera':
                return {
                    js: function(args) {
                        return {
                            v: `(new BABYLON.AnaglyphCamera(${tonotstr(args.NAME.v)}, new BABYLON.Vector3(${args.X.v}, ${args.Y.v}, ${args.Z.v}), 0, 0.1, scene))`,
                            t: Type.Object
                        };
                    },
                    args: [
                        genarg("NAME", Type.String, true),
                        genarg("X", Type.Number, true),
                        genarg("Y", Type.Number, true),
                        genarg("Z", Type.Number, true)
                    ]
                };

            // ---------- 获取相机 ----------
            case 'babylonjscamera_bjs_get_active_camera':
                return {
                    js: function(args) {
                        return { v: `scene.activeCamera`, t: Type.Object };
                    },
                    args: []
                };
            case 'babylonjscamera_bjs_get_camera_by_name':
                return {
                    js: function(args) {
                        return {
                            v: `scene.getCameraByName(${tonotstr(args.NAME.v)})`,
                            t: Type.Object
                        };
                    },
                    args: [
                        genarg("NAME", Type.String, true)
                    ]
                };

            // ---------- 属性键 Reporter ----------
            case 'babylonjscamera_bjs_common_cam_key':
                return {
                    js: function(args) {
                        return { v: `${args.KEY}`, t: Type.String };
                    },
                    args: [
                        genarg("KEY", Type.Any, false)
                    ]
                };
            case 'babylonjscamera_bjs_arc_cam_key':
                return {
                    js: function(args) {
                        return { v: `${args.KEY}`, t: Type.String };
                    },
                    args: [
                        genarg("KEY", Type.Any, false)
                    ]
                };
            case 'babylonjscamera_bjs_follow_cam_key':
                return {
                    js: function(args) {
                        return { v: `${args.KEY}`, t: Type.String };
                    },
                    args: [
                        genarg("KEY", Type.Any, false)
                    ]
                };
            case 'babylonjscamera_bjs_fly_cam_key':
                return {
                    js: function(args) {
                        return { v: `${args.KEY}`, t: Type.String };
                    },
                    args: [
                        genarg("KEY", Type.Any, false)
                    ]
                };
            case 'babylonjscamera_bjs_joystick_cam_key':
                return {
                    js: function(args) {
                        return { v: `${args.KEY}`, t: Type.String };
                    },
                    args: [
                        genarg("KEY", Type.Any, false)
                    ]
                };
        }
        return null;
    }

    op(opcode) {
        switch (opcode) {
            case 'babylonjscamera_bjs_set_active_camera':
                return {
                    js: function(args) {
                        return `scene.activeCamera = ${tonotstr(args.CAMERA.v)};`;
                    },
                    args: [
                        genarg("CAMERA", Type.Object, true)
                    ]
                };

            case 'babylonjscamera_bjs_set_camera_property':
                return {
                    js: function(args) {
                        let camera = tonotstr(args.CAMERA.v);
                        let prop = args.PROP.v;
                        let value = args.VALUE.v;
                        return `${camera}.${prop} = ${value};`;
                    },
                    args: [
                        genarg("CAMERA", Type.Object, true),
                        genarg("PROP", Type.String, true),
                        genarg("VALUE", Type.Any, true)
                    ]
                };

            case 'babylonjscamera_bjs_set_arc_camera_property':
                return {
                    js: function(args) {
                        let camera = tonotstr(args.CAMERA.v);
                        let prop = args.PROP.v;
                        let value = args.VALUE.v;
                        return `${camera}.${prop} = ${value};`;
                    },
                    args: [
                        genarg("CAMERA", Type.Object, true),
                        genarg("PROP", Type.String, true),
                        genarg("VALUE", Type.Any, true)
                    ]
                };

            case 'babylonjscamera_bjs_set_follow_camera_property':
                return {
                    js: function(args) {
                        let camera = tonotstr(args.CAMERA.v);
                        let prop = args.PROP.v;
                        let value = args.VALUE.v;
                        return `${camera}.${prop} = ${value};`;
                    },
                    args: [
                        genarg("CAMERA", Type.Object, true),
                        genarg("PROP", Type.String, true),
                        genarg("VALUE", Type.Any, true)
                    ]
                };
        }
        return null;
    }
}

module.exports = new ext();