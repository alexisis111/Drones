import { useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sky } from '@react-three/drei';
import * as THREE from 'three';

// ——— ПОМОЩНИК: МЕТАЛЛИЧЕСКАЯ БАЛКА ———
type Vec3 = [number, number, number];
type BoxArgs = [number, number, number];

type BeamProps = {
    position: Vec3;
    args: BoxArgs;
    color?: string;
    metalness?: number;
    roughness?: number;
};

const Beam = ({ position, args, color = '#4b5563', metalness = 0.7, roughness = 0.4 }: BeamProps) => (
    <Box args={args} position={position}>
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </Box>
);

const CageProtection = () => {
    const cageW = 12;
    const cageD = 12;
    const cellSize = 1.5;

    // Здание: Box args={[6,4,6]} position={[0,2,0]} => крыша на y = 4
    const buildingRoofY = 4;
    // 3 уровня горизонтальной защиты: 1-й чуть выше крыши, 2-й выше, 3-й ещё выше
    const firstLevelClearance = 0.6;
    const levelGap = 1.4;
    const levels = [
        buildingRoofY + firstLevelClearance,
        buildingRoofY + firstLevelClearance + levelGap,
        buildingRoofY + firstLevelClearance + 2 * levelGap,
    ];

    // Высота клетки от сцены до верхнего уровня (стойки доходят до верха)
    const cageH = levels[2];

    const cellsX = Math.floor(cageW / cellSize); // 8
    const cellsZ = Math.floor(cageD / cellSize); // 8
    const supportsX = cellsX + 1; // 9
    const supportsZ = cellsZ + 1; // 9

    // ——— ВЕРТИКАЛЬНЫЕ СТОЙКИ (тонкие) ———
    const verticalBeams: ReactElement[] = [];
    for (let ix = 0; ix < supportsX; ix++) {
        for (let iz = 0; iz < supportsZ; iz++) {
            const x = -cageW / 2 + ix * cellSize;
            const z = -cageD / 2 + iz * cellSize;
            verticalBeams.push(
                <group key={`support-${ix}-${iz}`} position={[x, cageH/2, z]}>
                    {/* Тонкая стойка */}
                    <Beam
                        position={[0, 0, 0]}
                        args={[0.05, cageH, 0.05]}
                        color="#78350f"
                        metalness={0.8}
                        roughness={0.3}
                    />
                </group>
            );
        }
    }

    // ——— ГОРИЗОНТАЛЬНЫЕ БАЛКИ (тонкие) ———
    const horizontalBeams: ReactElement[] = [];
    levels.forEach((y, levelIdx) => {
        // Продольные балки (вдоль Z): X фикс, Z меняется → длина = cageD
        for (let ix = 0; ix < supportsX; ix++) {
            const x = -cageW / 2 + ix * cellSize;
            horizontalBeams.push(
                <Beam
                    key={`long-${levelIdx}-${ix}`}
                    position={[x, y, 0]}
                    args={[0.03, 0.03, cageD]} // тонкие балки
                    color="#78350f"
                    metalness={0.8}
                    roughness={0.3}
                />
            );
        }

        // Поперечные балки (вдоль X): Z фикс, X меняется → длина = cageW
        for (let iz = 0; iz < supportsZ; iz++) {
            const z = -cageD / 2 + iz * cellSize;
            horizontalBeams.push(
                <Beam
                    key={`trans-${levelIdx}-${iz}`}
                    position={[0, y, z]}
                    args={[cageW, 0.03, 0.03]}
                    color="#78350f"
                    metalness={0.8}
                    roughness={0.3}
                />
            );
        }
    });

    // ——— СЕТКА (3 уровня сверху + 4 стены) ———
    // Важно: слишком мелкая ячейка (типа 0.1) создаёт тысячи мешей и может сильно просадить FPS.
    const meshLines: ReactElement[] = [];
    const meshCellSize = 0.1;
    const wireThickness = 0.01;
    const wireMat = <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.5} />;
    // Крыша: XZ плоскость на каждом уровне
    levels.forEach((y, levelIdx) => {
        // Линии вдоль Z (фиксируем X)
        for (let ix = 0; ix <= Math.floor(cageW / meshCellSize); ix++) {
            const x = -cageW / 2 + ix * meshCellSize;
            meshLines.push(
                <mesh key={`roof-x-${levelIdx}-${ix}`} position={[x, y, 0]}>
                    <boxGeometry args={[wireThickness, wireThickness, cageD]} />
                    {wireMat}
                </mesh>
            );
        }
        // Линии вдоль X (фиксируем Z)
        for (let iz = 0; iz <= Math.floor(cageD / meshCellSize); iz++) {
            const z = -cageD / 2 + iz * meshCellSize;
            meshLines.push(
                <mesh key={`roof-z-${levelIdx}-${iz}`} position={[0, y, z]}>
                    <boxGeometry args={[cageW, wireThickness, wireThickness]} />
                    {wireMat}
                </mesh>
            );
        }
    });

    // Стены: высота 0..cageH
    const ySteps = Math.floor(cageH / meshCellSize);
    const zFront = -cageD / 2 + wireThickness / 2;
    const zBack = cageD / 2 - wireThickness / 2;
    const xLeft = -cageW / 2 + wireThickness / 2;
    const xRight = cageW / 2 - wireThickness / 2;

    // Перед/зад (плоскость XY): Z фикс
    for (let iy = 0; iy <= ySteps; iy++) {
        const y = iy * meshCellSize;
        // горизонтальные прутья (вдоль X)
        meshLines.push(
            <mesh key={`front-h-${iy}`} position={[0, y, zFront]}>
                <boxGeometry args={[cageW, wireThickness, wireThickness]} />
                {wireMat}
            </mesh>
        );
        meshLines.push(
            <mesh key={`back-h-${iy}`} position={[0, y, zBack]}>
                <boxGeometry args={[cageW, wireThickness, wireThickness]} />
                {wireMat}
            </mesh>
        );
    }
    for (let ix = 0; ix <= Math.floor(cageW / meshCellSize); ix++) {
        const x = -cageW / 2 + ix * meshCellSize;
        // вертикальные прутья (вдоль Y)
        meshLines.push(
            <mesh key={`front-v-${ix}`} position={[x, cageH / 2, zFront]}>
                <boxGeometry args={[wireThickness, cageH, wireThickness]} />
                {wireMat}
            </mesh>
        );
        meshLines.push(
            <mesh key={`back-v-${ix}`} position={[x, cageH / 2, zBack]}>
                <boxGeometry args={[wireThickness, cageH, wireThickness]} />
                {wireMat}
            </mesh>
        );
    }

    // Лево/право (плоскость YZ): X фикс
    for (let iy = 0; iy <= ySteps; iy++) {
        const y = iy * meshCellSize;
        // горизонтальные прутья (вдоль Z)
        meshLines.push(
            <mesh key={`left-h-${iy}`} position={[xLeft, y, 0]}>
                <boxGeometry args={[wireThickness, wireThickness, cageD]} />
                {wireMat}
            </mesh>
        );
        meshLines.push(
            <mesh key={`right-h-${iy}`} position={[xRight, y, 0]}>
                <boxGeometry args={[wireThickness, wireThickness, cageD]} />
                {wireMat}
            </mesh>
        );
    }
    for (let iz = 0; iz <= Math.floor(cageD / meshCellSize); iz++) {
        const z = -cageD / 2 + iz * meshCellSize;
        // вертикальные прутья (вдоль Y)
        meshLines.push(
            <mesh key={`left-v-${iz}`} position={[xLeft, cageH / 2, z]}>
                <boxGeometry args={[wireThickness, cageH, wireThickness]} />
                {wireMat}
            </mesh>
        );
        meshLines.push(
            <mesh key={`right-v-${iz}`} position={[xRight, cageH / 2, z]}>
                <boxGeometry args={[wireThickness, cageH, wireThickness]} />
                {wireMat}
            </mesh>
        );
    }



    return (
        <group>
            {verticalBeams}
            {horizontalBeams}
            {meshLines}
        </group>
    );
};
// ——— ЗДАНИЕ (защищаемый объект) ———
const ProtectedObject = () => {
    return (
        <group>
            <Box args={[6, 4, 6]} position={[0, 2, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.7} />
            </Box>
            {/* Оконные проёмы */}
            {Array.from({ length: 6 }).map((_, i) => {
                const row = Math.floor(i / 3);
                const col = i % 3;
                const x = -2 + col * 2;
                const z = row === 0 ? 3.05 : -3.05;
                const y = 1.5 + (row === 0 ? 0 : 1.5);
                return (
                    <Box
                        key={`window-${i}`}
                        args={[1.4, 1.2, 0.05]}
                        position={[x, y, z]}
                        rotation={[0, row === 0 ? 0 : Math.PI, 0]}
                    >
                        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
                    </Box>
                );
            })}
        </group>
    );
};

// ——— ДРОН ———
type AnimatedDroneProps = {
    position: Vec3;
    rotationOffset?: number;
    speed?: number;
};

const AnimatedDrone = ({ position, rotationOffset = 0, speed = 1 }: AnimatedDroneProps) => {
    const droneRef = useRef<THREE.Group | null>(null);

    useFrame((state) => {
        if (droneRef.current) {
            // Плавающее движение
            const floatOffset = Math.sin(state.clock.elapsedTime * 2 * speed) * 0.1;
            droneRef.current.position.y = position[1] + floatOffset;

            // Вращение дрона
            droneRef.current.rotation.y = rotationOffset + state.clock.elapsedTime * 0.2 * speed;

            // Легкое покачивание
            droneRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
            droneRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 1.5) * 0.05;
        }
    });

    return (
        <group ref={droneRef} position={position}>
            {/* Центральный корпус - более реалистичный */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
                <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Батарейный отсек спереди */}
            <mesh position={[0, 0, 0.2]}>
                <boxGeometry args={[0.15, 0.08, 0.2]} />
                <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Камера/сенсор спереди */}
            <mesh position={[0, 0, 0.32]}>
                <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Светодиодный индикатор */}
            <mesh position={[0, 0.08, -0.1]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={2} />
            </mesh>

            {/* Рама дрона - X-образная структура */}
            {/* Передняя правая рама */}
            <mesh position={[0.18, 0, 0.18]} rotation={[0, -Math.PI/4, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
                <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Передняя левая рама */}
            <mesh position={[-0.18, 0, 0.18]} rotation={[0, Math.PI/4, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
                <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Задняя левая рама */}
            <mesh position={[-0.18, 0, -0.18]} rotation={[0, 3*Math.PI/4, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
                <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
            </mesh>
           , [28.01.2026 22:19]
            {/* Задняя правая рама */}
            <mesh position={[0.18, 0, -0.18]} rotation={[0, -3*Math.PI/4, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
                <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Пропеллеры с анимацией */}
            {/* Передний правый */}
            <Propeller position={[0.42, 0.1, 0.42]} />
            {/* Передний левый */}
            <Propeller position={[-0.42, 0.1, 0.42]} />
            {/* Задний левый */}
            <Propeller position={[-0.42, 0.1, -0.42]} />
            {/* Задний правый */}
            <Propeller position={[0.42, 0.1, -0.42]} />
        </group>
    );
};

type PropellerProps = {
    position: Vec3;
};

const Propeller = ({ position }: PropellerProps) => {
    const ref = useRef<THREE.Group | null>(null);
    useFrame((state) => {
        if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 10;
    });
    return (
        <group ref={ref} position={position}>
            {/* Центральное крепление */}
            <mesh>
                <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
                <meshStandardMaterial color="#555555" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Лопасти пропеллера */}
            <mesh rotation={[0, 0, Math.PI/2]}>
                <boxGeometry args={[0.25, 0.01, 0.05]} />
                <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh>
                <boxGeometry args={[0.05, 0.01, 0.25]} />
                <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
    );
};

type ExplosionProps = {
    position: Vec3;
    duration?: number;
    onDone: () => void;
};

const Explosion = ({ position, duration = 0.6, onDone }: ExplosionProps) => {
    const ref = useRef<THREE.Mesh | null>(null);
    const startRef = useRef<number | null>(null);

    useFrame((state) => {
        if (!ref.current) return;
        if (startRef.current == null) startRef.current = state.clock.elapsedTime;

        const t = state.clock.elapsedTime - startRef.current;
        const p = Math.min(1, t / duration);

        const s = 0.4 + p * 2.8;
        ref.current.scale.setScalar(s);
        (ref.current.material as THREE.MeshStandardMaterial).opacity = 0.9 * (1 - p);
        (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.5 * (1 - p);

        if (p >= 1) onDone();
    });

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[0.35, 18, 18]} />
            <meshStandardMaterial
                color="#f97316"
                emissive="#fb923c"
                emissiveIntensity={2.5}
                transparent
                opacity={0.9}
                roughness={0.4}
                metalness={0.1}
            />
        </mesh>
    );
};

type DroneMissileProps = {
    id: number;
    spawn: Vec3;
    target: Vec3;
    speed: number;
    respawnDelay?: number;
    cageW: number;
    cageD: number;
    cageH: number;
    levels: number[];
};

const DroneMissile = ({
                          id,
                          spawn,
                          target,
                          speed,
                          respawnDelay = 0.6,
                          cageW,
                          cageD,
                          cageH,
                          levels,
                      }: DroneMissileProps) => {
    const droneRef = useRef<THREE.Group | null>(null);
    const [phase, setPhase] = useState<'flying' | 'exploding' | 'waiting'>('flying');
    const [explosionPos, setExplosionPos] = useState<Vec3>(target);
    const waitUntilRef = useRef<number>(0);

    // локальная "сидовая" смена спавна без Math.random()
    const makeSpawn = (k: number): Vec3 => {
        const a = (id * 1.7 + k * 2.3) % (Math.PI * 2);
        const r = 22 + hash01(id * 10 + k, id * 20 + k) * 6;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const y = 4 + hash01(id * 30 + k, id * 40 + k) * 6;
        return [x, y, z];
    };

    const spawnStepRef = useRef<number>(0);

    useFrame((state, delta) => {
        if (!droneRef.current) return;

        if (phase === 'waiting') {
            droneRef.current.visible = false;
            if (state.clock.elapsedTime >= waitUntilRef.current) {
                spawnStepRef.current += 1;
                const s = makeSpawn(spawnStepRef.current);
                droneRef.current.position.set(s[0], s[1], s[2]);
                setPhase('flying');
                droneRef.current.visible = true;
            }
            return;
        }

        if (phase !== 'flying') return;

        const pos = droneRef.current.position;
        const dir = new THREE.Vector3(target[0] - pos.x, target[1] - pos.y, target[2] - pos.z);
        const dist = dir.length();
        if (dist < 0.001) return;

        dir.normalize();
        pos.x += dir.x * speed * delta;
        pos.y += dir.y * speed * delta;
        pos.z += dir.z * speed * delta;

        // поворот "носом" к цели
        droneRef.current.lookAt(target[0], target[1], target[2]);

        // Столкновение с защитой (4 стены + 3 уровня сверху)
        const halfW = cageW / 2;
        const halfD = cageD / 2;
        const hitThickness = 0.22;

        const insideXZ = Math.abs(pos.x) <= halfW + hitThickness && Math.abs(pos.z) <= halfD + hitThickness;
        const withinH = pos.y >= -0.2 && pos.y <= cageH + 0.2;

        // 4 стены: x=±halfW, z=±halfD
        const hitWall =
            withinH &&
            insideXZ &&
            (Math.abs(Math.abs(pos.x) - halfW) <= hitThickness || Math.abs(Math.abs(pos.z) - halfD) <= hitThickness);

        // 3 горизонтальных уровня (как "крыша" на уровнях)
        const hitLevel =
            insideXZ &&
            levels.some((ly) => Math.abs(pos.y - ly) <= hitThickness);

        if (hitWall || hitLevel) {
            setExplosionPos([pos.x, pos.y, pos.z]);
            setPhase('exploding');
            droneRef.current.visible = false;
            waitUntilRef.current = state.clock.elapsedTime + respawnDelay;
        }
    });

    const [sx, sy, sz] = spawn;

    return (
        <group>
            <group ref={droneRef} position={[sx, sy, sz]}>
                <AnimatedDrone position={[0, 0, 0]} rotationOffset={0} speed={1} />
            </group>

            {phase === 'exploding' && (
                <Explosion
                    position={explosionPos}
                    onDone={() => {
                        setPhase('waiting');
                    }}
                />
            )}
        </group>
    );
};

const DroneAttackLoop = () => {
    // Параметры защиты (должны соответствовать CageProtection)
    const cageW = 12;
    const cageD = 12;
    const buildingRoofY = 4;
    const firstLevelClearance = 0.6;
    const levelGap = 1.4;
    const levels = [
        buildingRoofY + firstLevelClearance,
        buildingRoofY + firstLevelClearance + levelGap,
        buildingRoofY + firstLevelClearance + 2 * levelGap,
    ];
    const cageH = levels[2];

    // Цель полёта (внутрь), но взрыв произойдёт при касании защиты
    const target: Vec3 = [0, buildingRoofY + 0.5, 0];

    const drones = useMemo(
        () => [
            { id: 0, spawn: [-26, 8, 18] as Vec3, speed: 6.5 },
            { id: 1, spawn: [22, 7, -24] as Vec3, speed: 7.2 },
            { id: 2, spawn: [-18, 9, -22] as Vec3, speed: 6.8 },
        ],
        []
    );

    return (
        <group>
            {drones.map((d) => (
                <DroneMissile
                    key={d.id}
                    id={d.id}
                    spawn={d.spawn}
                    target={target}
                    speed={d.speed}
                    cageW={cageW}
                    cageD={cageD}
                    cageH={cageH}
                    levels={levels}
                />
            ))}
        </group>
    );
};

// ——— ДЕТЕРМИНИРОВАННЫЙ "ШАМ" (без Math.random в рендере) ———
function hash01(x: number, z: number) {
    // простая хеш‑функция -> [0..1)
    const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
    return s - Math.floor(s);
}

// ——— ОКРУЖЕНИЕ: ДЕРЕВЬЯ, ТРАВА, КАМНИ, КУСТЫ, ЦВЕТЫ ———
const Environment = () => {
    // Создаем массив позиций для деревьев
    const treePositions = [
        [-10, 0, -10], [8, 0, -12], [-12, 0, 8], [10, 0, 10],
        [-15, 0, -5], [12, 0, -8], [-8, 0, 12], [15, 0, 5],
        [-5, 0, -15], [5, 0, -15], [-15, 0, 5], [15, 0, -15]
    ];

    // Создаем массив позиций для камней
    const rockPositions = [
        [-14, 0, -14], [14, 0, -14], [-14, 0, 14], [14, 0, 14],
        [-12, 0, 12], [12, 0, 12], [-10, 0, -14], [10, 0, -14]
    ];


// Создаем массив позиций для кустов
    const bushPositions = [
        [-16, 0, -16], [16, 0, -16], [-16, 0, 16], [16, 0, 16],
        [-18, 0, -8], [18, 0, -8], [-18, 0, 8], [18, 0, 8],
        [-8, 0, -18], [8, 0, -18], [-8, 0, 18], [8, 0, 18]
    ];

    // Создаем массив позиций для цветов
    const flowerPositions = [];
    for (let i = -18; i <= 18; i += 3) {
        for (let j = -18; j <= 18; j += 3) {
            // Исключаем область вокруг здания и добавляем детерминированную "случайность"
            if (!(i > -5 && i < 5 && j > -5 && j < 5) && hash01(i, j) > 0.72) {
                flowerPositions.push([i, 0, j]);
            }
        }
    }

    // Создаем массив позиций для травы
    const grassPositions = [];
    for (let i = -20; i <= 20; i += 1.5) {
        for (let j = -20; j <= 20; j += 1.5) {
            // Исключаем небольшую область вокруг здания
            if (!(i > -6 && i < 6 && j > -6 && j < 6)) {
                grassPositions.push([i, 0, j]);
            }
        }
    }

    return (
        <group>
            {/* Деревья */}
            {treePositions.map((pos, idx) => (
                <Tree key={`tree-${idx}`} position={pos as Vec3} />
            ))}

            {/* Камни */}
            {rockPositions.map((pos, idx) => (
                <Rock key={`rock-${idx}`} position={pos as Vec3} />
            ))}

            {/* Кусты */}
            {bushPositions.map((pos, idx) => (
                <Bush key={`bush-${idx}`} position={pos as Vec3} />
            ))}

            {/* Цветы */}
            {flowerPositions.map((pos, idx) => (
                <Flower key={`flower-${idx}`} position={pos as Vec3} />
            ))}

            {/* Трава - оптимизированная с использованием InstancedMesh */}
            <GrassField positions={grassPositions.slice(0, 700)} />
        </group>
    );
};

// Оптимизированный компонент для травы с использованием InstancedMesh
const GrassField = ({ positions }: { positions: number[][] }) => {
    const ref = useRef<THREE.InstancedMesh>(null!);
    const dummy = useRef<THREE.Object3D>(new THREE.Object3D());

    useFrame((state) => {
        if (!ref.current) return;

        // Анимация травы
        for (let i = 0; i < positions.length; i++) {
            const [x, , z] = positions[i];
            dummy.current.position.set(x, 0, z);
            const n = hash01(x, z);
            const baseH = 0.28 + n * 0.28;
            dummy.current.rotation.y = n * Math.PI * 2;
            dummy.current.scale.setScalar(0.9 + n * 0.35);
            dummy.current.scale.y = baseH + Math.sin(state.clock.elapsedTime * 2.2 + x * 0.15 + z * 0.15) * 0.06;
            dummy.current.updateMatrix();
            ref.current.setMatrixAt(i, dummy.current.matrix);
        }
        ref.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={ref}
            args={[undefined, undefined, positions.length]}
            position={[0, 0, 0]}
        >
            <boxGeometry args={[0.05, 0.5, 0.03]} />
            <meshStandardMaterial
                color="#228B22"
                roughness={0.9}
                metalness={0.05}
            />
        </instancedMesh>
    );
};

// Компонент дерева
const Tree = ({ position }: { position: Vec3 }) => {
    return (
        <group position={position}>
            {/* Ствол */}
            <mesh position={[0, 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.16, 0.22, 3, 10]} />
                <meshStandardMaterial color="#7c4a22" roughness={0.95} metalness={0.02} />
            </mesh>
            {/* Крона: несколько "шаров" для объёма */}
            <mesh position={[0, 3.8, 0]} castShadow>
                <sphereGeometry args={[1.15, 12, 12]} />
                <meshStandardMaterial color="#1f7a3a" roughness={0.95} metalness={0.02} />
            </mesh>
            <mesh position={[0.7, 3.4, 0.3]} castShadow>
                <sphereGeometry args={[0.85, 12, 12]} />
                <meshStandardMaterial color="#1b6b33" roughness={0.95} metalness={0.02} />
            </mesh>
            <mesh position={[-0.6, 3.5, -0.2]} castShadow>
                <sphereGeometry args={[0.9, 12, 12]} />
                <meshStandardMaterial color="#207f3c" roughness={0.95} metalness={0.02} />
            </mesh>
        </group>
    );
};


// Компонент камня
const Rock = ({ position }: { position: Vec3 }) => {
    return (
        <mesh position={[position[0], position[1] + 0.22, position[2]]} castShadow>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#6b7280" roughness={0.98} metalness={0.02} />
        </mesh>
    );
};

// Компонент куста
const Bush = ({ position }: { position: Vec3 }) => {
    return (
        <group position={position}>
            <mesh position={[0, 0.35, 0]} castShadow>
                <sphereGeometry args={[0.55, 12, 12]} />
                <meshStandardMaterial color="#1b6b33" roughness={0.95} metalness={0.02} />
            </mesh>
            <mesh position={[0.45, 0.25, 0.25]} castShadow>
                <sphereGeometry args={[0.4, 12, 12]} />
                <meshStandardMaterial color="#1f7a3a" roughness={0.95} metalness={0.02} />
            </mesh>
        </group>
    );
};

// Компонент цветка
const Flower = ({ position }: { position: Vec3 }) => {
    return (
        <group position={position}>
            {/* Стебель */}
            <Box args={[0.05, 0.4, 0.05]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#2e8b57" roughness={0.9} metalness={0.1} />
            </Box>
            {/* Цветок */}
            <mesh position={[0, 0.52, 0]} castShadow>
                <sphereGeometry args={[0.09, 10, 10]} />
                <meshStandardMaterial color="#f472b6" roughness={0.65} metalness={0.05} />
            </mesh>
            <mesh position={[0.08, 0.5, 0]} castShadow>
                <sphereGeometry args={[0.06, 10, 10]} />
                <meshStandardMaterial color="#fb7185" roughness={0.65} metalness={0.05} />
            </mesh>
        </group>
    );
};

// ——— ОБЛАКА (лёгкие, без текстур) ———
const DayClouds = () => {
    const groupRef = useRef<THREE.Group | null>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        // Медленное движение облаков
        groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.02) * 3;
        groupRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.02) * 3;
    });

    const cloudMat = (
        <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} transparent opacity={0.75} />
    );

    return (
        <group ref={groupRef} position={[0, 18, 0]}>
            {/* Облако 1 */}
            <group position={[-10, 0, -8]}>
                <mesh>{cloudMat}<sphereGeometry args={[1.8, 12, 12]} /></mesh>
                <mesh position={[1.4, 0.2, 0.3]}>{cloudMat}<sphereGeometry args={[1.4, 12, 12]} /></mesh>
                <mesh position={[-1.3, 0.15, -0.2]}>{cloudMat}<sphereGeometry args={[1.3, 12, 12]} /></mesh>
                <mesh position={[0.3, -0.1, -1.0]}>{cloudMat}<sphereGeometry args={[1.2, 12, 12]} /></mesh>
            </group>

            {/* Облако 2 */}
            <group position={[12, 1.2, 10]}>
                <mesh>{cloudMat}<sphereGeometry args={[2.1, 12, 12]} /></mesh>
                <mesh position={[1.6, 0.1, 0.4]}>{cloudMat}<sphereGeometry args={[1.6, 12, 12]} /></mesh>
                <mesh position={[-1.5, 0.2, -0.3]}>{cloudMat}<sphereGeometry args={[1.5, 12, 12]} /></mesh>
                <mesh position={[0.2, -0.15, -1.2]}>{cloudMat}<sphereGeometry args={[1.3, 12, 12]} /></mesh>
            </group>

            {/* Облако 3 */}
            <group position={[0, 0.6, -16]}>
                <mesh>{cloudMat}<sphereGeometry args={[1.6, 12, 12]} /></mesh>
                <mesh position={[1.2, 0.1, 0.2]}>{cloudMat}<sphereGeometry args={[1.2, 12, 12]} /></mesh>
                <mesh position={[-1.1, 0.15, -0.2]}>{cloudMat}<sphereGeometry args={[1.1, 12, 12]} /></mesh>
            </group>
        </group>
    );
};

// ——— ОСНОВНОЙ КОМПОНЕНТ ———
const ZOKVisualization = ({ enableControls = true }) => {
    // When controls are disabled, we want to allow scrolling on mobile
    // We'll conditionally apply styles to the canvas to prevent it from capturing touch events
    const canvasStyle = enableControls ?
        {} :
        {
            // When controls are disabled, allow touch events to pass through to parent elements
            touchAction: 'auto' as const,
            // Disable pointer events to allow scrolling when controls are disabled
            pointerEvents: 'none' as const
        };

    return (
        <div
            className="w-full h-[500px] rounded-xl overflow-hidden bg-gray-50 relative"
            style={{
                // This ensures that when controls are disabled, touch events can scroll the page
                touchAction: enableControls ? 'none' : 'auto'
            }}
        >
            <Canvas
                style={canvasStyle}
                camera={{ position: [18, 12, 18], fov: 50 }}
                gl={{ antialias: true, alpha: false }}
                shadows
            >
                <color attach="background" args={['#bfe3ff']} />
                <fog attach="fog" args={['#bfe3ff', 30, 95]} />
                <Sky
                    distance={450000}
                    sunPosition={[40, 30, 10]}
                    turbidity={6}
                    rayleigh={2.2}
                    mieCoefficient={0.004}
                    mieDirectionalG={0.9}
                />

                {/* Дневной свет */}
                <ambientLight intensity={0.5} />
                <hemisphereLight args={['#dbeafe', '#3b5b3b', 0.75]} />
                <directionalLight
                    position={[40, 30, 10]}
                    intensity={3.2}
                    color="#fff3d6"
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-near={5}
                    shadow-camera-far={120}
                    shadow-camera-left={-40}
                    shadow-camera-right={40}
                    shadow-camera-top={40}
                    shadow-camera-bottom={-40}
                />

                {/* Грунт */}
                <Box args={[40, 0.02, 40]} position={[0, -0.1, 0]} receiveShadow>
                    <meshStandardMaterial color="#5aa36a" roughness={1} metalness={0.02} />
                </Box>

                {/* Защитное заграждение */}
                <CageProtection />

                {/* Защищаемое здание */}
                <ProtectedObject />

                {/* Окружение */}
                <Environment />
                <DayClouds />

                {/* Дроны */}
                <DroneAttackLoop />

                <OrbitControls
                    enabled={enableControls}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={8}
                    maxDistance={40}
                />
            </Canvas>
        </div>
    );
};

export default ZOKVisualization;