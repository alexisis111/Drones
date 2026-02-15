import { useMemo, useRef, useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sky, useAnimations, Html } from '@react-three/drei';
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

// ——— ДЕТЕРМИНИРОВАННЫЙ "ХЕШ" (без Math.random в рендере) ———
function hash01(x: number, z: number) {
    // простая хеш‑функция -> [0..1)
    const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
    return s - Math.floor(s);
}

// ============= ПРОМЫШЛЕННОЕ ОКРУЖЕНИЕ =============

// Компонент дороги
const Road = () => {
    return (
        <group>
            {/* Основное дорожное полотно */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Разметка - горизонтальные линии */}
            {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
                <mesh key={`road-mark-h-${x}`} position={[x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.3, 2]} />
                    <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} />
                </mesh>
            ))}

            {/* Разметка - вертикальные линии */}
            {[-12, -8, -4, 0, 4, 8, 12].map((z) => (
                <mesh key={`road-mark-v-${z}`} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[2, 0.3]} />
                    <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} />
                </mesh>
            ))}

            {/* Круговая разметка вокруг здания */}
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[8, 8.2, 64]} />
                <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} />
            </mesh>

            {/* Бордюры */}
            {[-15, 15].map((x) => (
                <mesh key={`curb-x-${x}`} position={[x, 0.15, 0]}>
                    <boxGeometry args={[0.2, 0.3, 30]} />
                    <meshStandardMaterial color="#666666" roughness={0.7} metalness={0.1} />
                </mesh>
            ))}
            {[-15, 15].map((z) => (
                <mesh key={`curb-z-${z}`} position={[0, 0.15, z]}>
                    <boxGeometry args={[30, 0.3, 0.2]} />
                    <meshStandardMaterial color="#666666" roughness={0.7} metalness={0.1} />
                </mesh>
            ))}
        </group>
    );
};

// Компонент фонарного столба
const StreetLight = ({ position }: { position: Vec3 }) => {
    return (
        <group position={position}>
            {/* Столб */}
            <mesh position={[0, 2.5, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 5, 8]} />
                <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Основание */}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.3, 0.4, 0.4, 8]} />
                <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.4} />
            </mesh>

            {/* Кронштейн */}
            <mesh position={[0.5, 4.2, 0]} rotation={[0, 0, -Math.PI/6]}>
                <boxGeometry args={[1, 0.1, 0.1]} />
                <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Фонарь */}
            <mesh position={[1.2, 4.5, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#fffacd" emissive="#ffaa00" emissiveIntensity={0.8} />
            </mesh>

            {/* Свет от фонаря (невидимый источник) */}
            <pointLight position={[1.2, 4.5, 0]} intensity={0.8} color="#ffaa00" distance={8} />
        </group>
    );
};

// Компонент промышленного здания/ангара
const IndustrialBuilding = ({ position, scale = 1 }: { position: Vec3; scale?: number }) => {
    return (
        <group position={position} scale={scale}>
            {/* Основное здание */}
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[4, 3, 4]} />
                <meshStandardMaterial color="#8b8b8b" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Крыша */}
            <mesh position={[0, 3.2, 0]} rotation={[0, 0, 0]} castShadow>
                <coneGeometry args={[2.5, 0.8, 4]} />
                <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.5} />
            </mesh>

            {/* Дымоход/труба */}
            <mesh position={[1.2, 4, 1.2]} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
                <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.3} />
            </mesh>

            {/* Окна */}
            {[-1.2, 1.2].map((x) => (
                <mesh key={`window-${x}`} position={[x, 1.5, 2.05]} castShadow>
                    <boxGeometry args={[1, 1, 0.1]} />
                    <meshStandardMaterial color="#87CEEB" emissive="#1E90FF" emissiveIntensity={0.3} />
                </mesh>
            ))}
        </group>
    );
};

// Компонент контейнера
const Container = ({ position, color = "#2E8B57" }: { position: Vec3; color?: string }) => {
    return (
        <group position={position}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[2, 1.2, 2]} />
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.6} />
            </mesh>

            {/* Угловые усиления */}
            {[-0.9, 0.9].map((x) =>
                [-0.9, 0.9].map((z) => (
                    <mesh key={`corner-${x}-${z}`} position={[x, 0.5, z]}>
                        <boxGeometry args={[0.1, 0.8, 0.1]} />
                        <meshStandardMaterial color="#AAAAAA" metalness={0.8} roughness={0.2} />
                    </mesh>
                ))
            )}
        </group>
    );
};

// Компонент крана
const Crane = ({ position }: { position: Vec3 }) => {
    return (
        <group position={position}>
            {/* Башня */}
            <mesh position={[0, 3, 0]} castShadow>
                <boxGeometry args={[0.8, 6, 0.8]} />
                <meshStandardMaterial color="#FF4500" metalness={0.5} roughness={0.4} />
            </mesh>

            {/* Стрела */}
            <mesh position={[2, 5, 0]} rotation={[0, 0, 0]} castShadow>
                <boxGeometry args={[6, 0.3, 0.5]} />
                <meshStandardMaterial color="#FF6347" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Противовес */}
            <mesh position={[-2, 5, 0]} castShadow>
                <boxGeometry args={[2, 0.8, 1]} />
                <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.4} />
            </mesh>

            {/* Кабина */}
            <mesh position={[0, 4, 0]} castShadow>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshStandardMaterial color="#87CEEB" />
            </mesh>

            {/* Трос и крюк (декоративные) */}
            <mesh position={[4, 4.8, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1, 6]} />
                <meshStandardMaterial color="#AAAAAA" metalness={1} roughness={0.1} />
            </mesh>
        </group>
    );
};

// Компонент индустриального окружения
const IndustrialEnvironment = () => {
    // Позиции для промышленных объектов
    const lightPositions = [
        [-12, 0, -12], [12, 0, -12], [-12, 0, 12], [12, 0, 12],
        [-18, 0, -8], [18, 0, -8], [-18, 0, 8], [18, 0, 8]
    ];

    const buildingPositions = [
        [-14, 0, -14], [14, 0, -14], [-14, 0, 14], [14, 0, 14]
    ];

    const containerPositions = [
        [-18, 0, -18], [18, 0, -18], [-18, 0, 18], [18, 0, 18],
        [-20, 0, -5], [20, 0, -5], [-20, 0, 5], [20, 0, 5],
        [-5, 0, -20], [5, 0, -20], [-5, 0, 20], [5, 0, 20]
    ];

    const cranePosition = [0, 0, -18];

    return (
        <group>
            {/* Дороги и разметка */}
            <Road />

            {/* Промышленные здания */}
            {buildingPositions.map((pos, idx) => (
                <IndustrialBuilding
                    key={`ind-building-${idx}`}
                    position={pos as Vec3}
                    scale={0.8 + idx * 0.1}
                />
            ))}

            {/* Контейнеры */}
            {containerPositions.map((pos, idx) => (
                <Container
                    key={`container-${idx}`}
                    position={pos as Vec3}
                    color={idx % 3 === 0 ? "#2E8B57" : idx % 3 === 1 ? "#B22222" : "#1E90FF"}
                />
            ))}

            {/* Кран */}
            <Crane position={cranePosition as Vec3} />

            {/* Фонарные столбы */}
            {lightPositions.map((pos, idx) => (
                <StreetLight key={`light-${idx}`} position={pos as Vec3} />
            ))}

            {/* Небольшие индустриальные детали */}

            {/* Вентиляционные трубы */}
            {[-8, 8].map((x) => (
                <mesh key={`vent-${x}`} position={[x, 0.5, -15]}>
                    <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
                    <meshStandardMaterial color="#777777" metalness={0.8} roughness={0.3} />
                </mesh>
            ))}

            {/* Ящики/паллеты */}
            {[-16, -12, 16, 12].map((x, i) => (
                <mesh key={`box-${i}`} position={[x, 0.3, 10]} castShadow>
                    <boxGeometry args={[0.8, 0.6, 0.8]} />
                    <meshStandardMaterial color="#8B4513" roughness={0.9} />
                </mesh>
            ))}

            {/* Дым/пар из труб (декоративный) */}
            {buildingPositions.slice(0, 2).map((pos, idx) => (
                <group key={`smoke-${idx}`} position={[pos[0] + 1.2, pos[1] + 5, pos[2] + 1.2]}>
                    <mesh>
                        <sphereGeometry args={[0.5, 8, 8]} />
                        <meshStandardMaterial color="#CCCCCC" transparent opacity={0.3} />
                    </mesh>
                    <mesh position={[0, 0.6, 0]}>
                        <sphereGeometry args={[0.4, 8, 8]} />
                        <meshStandardMaterial color="#DDDDDD" transparent opacity={0.4} />
                    </mesh>
                </group>
            ))}
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

// ——— КОМПОНЕНТ АВТОПОВОРОТА ———
const AutoRotate = ({ children, speed = 0.5 }: { children: React.ReactNode; speed?: number }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * speed;
        }
    });

    return <group ref={groupRef}>{children}</group>;
};

// ——— ОСНОВНОЙ КОМПОНЕНТ ———
const ZOKVisualization = ({ enableControls = true, autoRotate = true }) => {
    const [rotationSpeed, setRotationSpeed] = useState(0.3);

    // Эффект для плавного изменения скорости вращения
    useEffect(() => {
        if (autoRotate) {
            // Можно добавить логику изменения скорости со временем
            const interval = setInterval(() => {
                setRotationSpeed(prev => 0.2 + Math.random() * 0.3);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [autoRotate]);

    const canvasStyle = enableControls ?
        {} :
        {
            touchAction: 'auto' as const,
            pointerEvents: 'none' as const
        };

    return (
        <div
            className="w-full h-[600px] rounded-xl overflow-hidden bg-gray-900 relative"
            style={{
                touchAction: enableControls ? 'none' : 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
        >
            {/* Индикатор автоповорота */}
            {autoRotate && (
                <div className="absolute top-4 right-4 z-10 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Auto-rotate • {rotationSpeed.toFixed(1)}x</span>
                </div>
            )}

            <Canvas
                style={canvasStyle}
                camera={{ position: [25, 15, 25], fov: 45 }}
                gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
                shadows
                onCreated={({ gl }) => {
                    gl.setClearColor('#0a0a1a');
                }}
            >
                <color attach="background" args={['#0a0a1a']} />
                <fog attach="fog" args={['#0a0a1a', 40, 120]} />

                <Sky
                    distance={450000}
                    sunPosition={[100, 20, 50]}
                    turbidity={8}
                    rayleigh={1.5}
                    mieCoefficient={0.005}
                    mieDirectionalG={0.8}
                />

                {/* Освещение */}
                <ambientLight intensity={0.3} />
                <hemisphereLight args={['#446688', '#223322', 0.6]} />
                <directionalLight
                    position={[50, 30, 20]}
                    intensity={2.5}
                    color="#fff0dd"
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-near={5}
                    shadow-camera-far={150}
                    shadow-camera-left={-50}
                    shadow-camera-right={50}
                    shadow-camera-top={50}
                    shadow-camera-bottom={-50}
                />

                {/* Дополнительные источники света для индустриальной атмосферы */}
                <pointLight position={[0, 10, 0]} intensity={0.5} color="#4466aa" />
                <pointLight position={[-15, 5, -15]} intensity={0.8} color="#ffaa44" />
                <pointLight position={[15, 5, 15]} intensity={0.8} color="#ffaa44" />

                {/* Грунт (промышленная площадка) */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                    <planeGeometry args={[60, 60]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.9} metalness={0.1} />
                </mesh>

                {/* Контейнер для автоповорота */}
                <AutoRotate speed={rotationSpeed}>
                    {/* Защитное заграждение */}
                    <CageProtection />

                    {/* Защищаемое здание */}
                    <ProtectedObject />

                    {/* Промышленное окружение */}
                    <IndustrialEnvironment />

                    {/* Дроны (внутри вращающейся группы) */}
                    <DroneAttackLoop />
                </AutoRotate>

                {/* Облака (вне вращения, чтобы создавать глубину) */}
                <DayClouds />

                <OrbitControls
                    enabled={enableControls}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={15}
                    maxDistance={60}
                    autoRotate={false} // Отключаем встроенный autoRotate, используем наш
                    rotateSpeed={0.8}
                />

                {/* Легкая подсветка снизу для эффекта */}
                <pointLight position={[0, -5, 0]} intensity={0.2} color="#335588" />
            </Canvas>

            {/* Управление скоростью вращения (hover-эффект) */}
            {autoRotate && (
                <div className="absolute bottom-4 left-4 z-10 bg-black/30 text-white/70 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                    Скорость вращения меняется динамически
                </div>
            )}
        </div>
    );
};

export default ZOKVisualization;