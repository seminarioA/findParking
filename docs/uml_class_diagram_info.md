# Información para diagrama de clases UML

Este documento resume las clases, estructuras de datos y responsabilidades relevantes del proyecto **findParking** para facilitar la elaboración de un diagrama de clases UML. Cada microservicio se representa con tablas que siguen el formato solicitado (`Classname`, `+ field: type`, `+ method(type): type`).

## Auth Service (`api/auth/app`)

| Classname | Atributos | Métodos |
| --- | --- | --- |
| AuthService | **User**<br>`+ id: Integer`<br>`+ email: String`<br>`+ hashed_password: String`<br>`+ role: String`<br><br>**TokenBlacklist**<br>`+ id: Integer`<br>`+ jti: String`<br>`+ created_at: DateTime`<br><br>**UserCreate**<br>`+ email: EmailStr`<br>`+ password: str`<br>`+ role: str`<br><br>**UserLogin**<br>`+ email: EmailStr`<br>`+ password: str`<br><br>**TokenResponse**<br>`+ access_token: str`<br>`+ token_type: str`<br><br>**AuthRouter**<br>`—`<br><br>**SecurityModule**<br>`—`<br><br>**BlacklistManager**<br>`—` | **User**<br>`+ __init__(email: str, hashed_password: str, role: str): None`<br><br>**TokenBlacklist**<br>`+ __init__(jti: str): None`<br><br>**UserCreate / UserLogin / TokenResponse**<br>`+ model_dump(): dict`<br><br>**AuthRouter**<br>`+ register(user: UserCreate, db: Session): dict`<br>`+ login(credentials: UserLogin, db: Session): TokenResponse`<br>`+ logout(Authorization: str, db: Session): dict`<br>`+ get_me(Authorization: str, db: Session): dict`<br>`+ verify(Authorization: str, db: Session): dict`<br>`+ set_role(email: str, new_role: str, Authorization: str, db: Session): dict`<br><br>**SecurityModule**<br>`+ get_db(): Iterator[Session]`<br>`+ hash_password(password: str): str`<br>`+ verify_password(plain: str, hashed: str): bool`<br>`+ create_access_token(data: dict, expires_delta: timedelta \| None): str`<br>`+ verify_token(token: str, db: Session): dict`<br><br>**BlacklistManager**<br>`+ revoke_token(jti: str, db: Session): None` |

## Processing Service (`vision/processing`)

| Classname | Atributos | Métodos |
| --- | --- | --- |
| ProcessingService | **ConfigLoader**<br>`—`<br><br>**AreasLoader**<br>`—`<br><br>**ModelLoader**<br>`—`<br><br>**DeviceSelector**<br>`—`<br><br>**InferenceEngine**<br>`—`<br><br>**DrawingToolkit**<br>`—`<br><br>**VideoProcessor**<br>`—` | **ConfigLoader**<br>`+ load_config(): dict`<br><br>**AreasLoader**<br>`+ load_areas(path: str): dict[str, ndarray]`<br><br>**ModelLoader**<br>`+ load_model(path: str): YOLO`<br>`+ load_classes(file_path: str): list[str]`<br><br>**DeviceSelector**<br>`+ get_device(): str`<br><br>**InferenceEngine**<br>`+ detect_and_assign(frame: ndarray, results: list, class_list: list[str], polygons: dict[str, ndarray]): dict[str, int]`<br><br>**DrawingToolkit**<br>`+ mark_car(frame: ndarray, x1: int, y1: int, x2: int, y2: int, cx: int, cy: int): None`<br>`+ draw_spaces(frame: ndarray, occupancy: dict[str, int], polygons: dict[str, ndarray]): None`<br><br>**VideoProcessor**<br>`+ process_video(camera_id: str, stream_url: str, model: YOLO, class_list: list[str], polygons: dict[str, ndarray], device: str): None` |

## Video Stream Service (`vision/video_stream`)

| Classname | Atributos | Métodos |
| --- | --- | --- |
| VideoStreamService | **StreamConfig**<br>`+ VIDEO_PATHS: dict[str, str]`<br><br>**StreamUtils**<br>`—`<br><br>**CameraManager**<br>`—`<br><br>**VideoStreamApp**<br>`—` | **StreamConfig**<br>`+ get(camera_id: str): str \| None`<br><br>**StreamUtils**<br>`+ build_mjpeg_frame(jpeg_bytes: bytes): bytes`<br><br>**CameraManager**<br>`+ generate_mjpeg_stream(video_path: str): Iterator[bytes]`<br><br>**VideoStreamApp**<br>`+ stream_camera(camera_id: str): StreamingResponse` |

## Occupancy Service (`api/occupancy`)

| Classname | Atributos | Métodos |
| --- | --- | --- |
| OccupancyService | **RedisConnector**<br>`+ host: str`<br>`+ port: int`<br>`+ db: int`<br><br>**JWTGuard**<br>`—`<br><br>**OccupancyServiceApp**<br>`—`<br><br>**OccupancyPayload**<br>`+ areas: dict[str, int]`<br>`+ summary: dict[str, int]` | **RedisConnector**<br>`+ get(key: str): bytes \| None`<br><br>**JWTGuard**<br>`+ verify_jwt(token: HTTPAuthorizationCredentials): dict`<br><br>**OccupancyServiceApp**<br>`+ occupancy_ws(websocket: WebSocket, camera_id: str, token: str \| None): Coroutine[None, None, None]`<br>`+ get_occupancy(camera_id: str, user: dict): dict`<br><br>**OccupancyPayload**<br>`+ summarize(): dict[str, int]` |

## Front-End Service (`ui/frontend`)

| Classname | Atributos | Métodos |
| --- | --- | --- |
| FrontEndService | **App**<br>`+ cameraId: string`<br>`+ token: string \| null`<br>`+ role: string \| null`<br>`+ darkMode: boolean`<br><br>**Login**<br>`+ onLogin: (token: string) => void`<br>`+ email: string`<br>`+ password: string`<br>`+ error: string`<br>`+ loading: boolean`<br>`+ showRegister: boolean`<br><br>**Register**<br>`+ onBack: () => void`<br>`+ email: string`<br>`+ password: string`<br>`+ confirm: string`<br>`+ fieldErrors: Record<string, string>`<br>`+ globalMessage: { type: 'success' \| 'error'; text: string } \| null`<br><br>**Occupancy**<br>`+ cameraId: string`<br>`+ token: string`<br>`+ darkMode: boolean \| undefined`<br>`+ data: any`<br>`+ error: string`<br>`+ animatedOccupied: number`<br>`+ animatedFree: number`<br><br>**VideoStream**<br>`+ cameraId: string`<br>`+ token: string`<br>`+ darkMode: boolean`<br>`+ imgRef: MutableRefObject<HTMLImageElement \| null>`<br>`+ mode: 'processed' \| 'original'`<br>`+ maximized: boolean`<br><br>**Footer**<br>`+ darkMode: boolean`<br>`+ sx: SxProps \| undefined`<br><br>**AuthAPI**<br>`—`<br><br>**RegisterAPI**<br>`—`<br><br>**OccupancyAPI**<br>`—`<br><br>**VideoAPI**<br>`—` | **App**<br>`+ handleLogin(newToken: string): Promise<void>`<br>`+ handleLogout(): void`<br>`+ setDarkMode(value: boolean): void`<br>`+ getRole(token: string): Promise<string>`<br><br>**Login**<br>`+ handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void>`<br>`+ setShowRegister(value: boolean): void`<br><br>**Register**<br>`+ validate(): Record<string, string>`<br>`+ handleRegister(e: FormEvent<HTMLFormElement>): Promise<void>`<br><br>**Occupancy**<br>`+ speakAvailability(free: number): void`<br>`+ getSummaryColor(free: number, dark: boolean): string`<br>`+ useEffect(getOccupancy \& listenWebSocket): void`<br><br>**VideoStream**<br>`+ useEffect(connectWebSocket): void`<br>`+ setMode(value: 'processed' \| 'original'): void`<br>`+ setMaximized(value: boolean): void`<br><br>**Footer**<br>`+ render(): JSX.Element`<br><br>**AuthAPI**<br>`+ login(email: string, password: string): Promise<string>`<br>`+ getRole(token: string): Promise<string>`<br><br>**RegisterAPI**<br>`+ register(email: string, password: string): Promise<void>`<br><br>**OccupancyAPI**<br>`+ getOccupancy(cameraId: string, token: string): Promise<any>`<br><br>**VideoAPI**<br>`+ getVideoStream(cameraId: string, mode: 'processed' \| 'original'): string` |

## Relaciones inter-servicio sugeridas

| Origen | Destino | Descripción |
| --- | --- | --- |
| Processing Service | RedisConnector | Publica frames procesados y estados de ocupación consumidos por otros servicios. |
| Occupancy Service | RedisConnector | Consulta los estados de ocupación generados por el servicio de procesamiento. |
| Video Stream Service | Processing Service | Provee streams MJPEG como fuente de video para la inferencia. |
| Auth Service | Occupancy Service | Los tokens emitidos por Auth se validan antes de exponer datos de ocupación. |
| Front-End Service | Auth / Video Stream / Occupancy | Consume autenticación, video y ocupación para la experiencia del usuario final. |

## Recomendaciones para el diagrama UML

1. **Incluir todos los microservicios:** Modelar Auth, Processing, Video Stream y Occupancy con el mismo nivel de detalle en atributos y operaciones.
2. **Resaltar atributos críticos:** Roles, identificadores de tokens y estructuras de ocupación ayudan a comprender la seguridad y el flujo de datos.
3. **Anotar dependencias tecnológicas:** Mostrar conexiones con Redis, base de datos SQL, OpenCV, Ultralytics y Torch según corresponda.
4. **Integrar actores externos:** Usuario final, sistema de cámaras y cualquier cliente que consuma los endpoints.

Esta estructura proporciona la base necesaria para construir un diagrama de clases UML equilibrado entre microservicios y, de ser necesario, extenderlo a diagramas de componentes o despliegue.

## Código PlantUML por microservicio

### Auth Service

```plantuml
@startuml

skinparam classAttributeIconSize 0

class User {
  +id: Integer
  +email: String
  +hashed_password: String
  +role: String
  ..
  +__init__(email: str, hashed_password: str, role: str): None
}

class TokenBlacklist {
  +id: Integer
  +jti: String
  +created_at: DateTime
  ..
  +__init__(jti: str): None
}

class UserCreate {
  +email: EmailStr
  +password: str
  +role: str
  ..
  +model_dump(): dict
}

class UserLogin {
  +email: EmailStr
  +password: str
  ..
  +model_dump(): dict
}

class TokenResponse {
  +access_token: str
  +token_type: str
  ..
  +model_dump(): dict
}

class AuthRouter {
  +register(user: UserCreate, db: Session): dict
  +login(credentials: UserLogin, db: Session): TokenResponse
  +logout(authorization: str, db: Session): dict
  +get_me(authorization: str, db: Session): dict
  +verify(authorization: str, db: Session): dict
  +set_role(email: str, new_role: str, authorization: str, db: Session): dict
}

class SecurityModule {
  +get_db(): Iterator[Session]
  +hash_password(password: str): str
  +verify_password(plain: str, hashed: str): bool
  +create_access_token(data: dict, expires_delta: timedelta | None): str
  +verify_token(token: str, db: Session): dict
}

class BlacklistManager {
  +revoke_token(jti: str, db: Session): None
}

AuthRouter --> UserCreate : utiliza
AuthRouter --> UserLogin : valida
AuthRouter --> TokenResponse : retorna
AuthRouter --> SecurityModule : depende
AuthRouter --> BlacklistManager : delega bloqueo
SecurityModule --> User : gestiona credenciales
SecurityModule --> TokenBlacklist : verifica revocación
BlacklistManager --> TokenBlacklist : administra
TokenResponse --> TokenBlacklist : referencia jti

@enduml
```

### Processing Service

```plantuml
@startuml

skinparam classAttributeIconSize 0

class ConfigLoader {
  +load_config(): dict
}

class AreasLoader {
  +load_areas(path: str): dict[str, ndarray]
}

class ModelLoader {
  +load_model(path: str): YOLO
  +load_classes(file_path: str): list[str]
}

class DeviceSelector {
  +get_device(): str
}

class InferenceEngine {
  +detect_and_assign(frame: ndarray, results: list, class_list: list[str], polygons: dict[str, ndarray]): dict[str, int]
}

class DrawingToolkit {
  +mark_car(frame: ndarray, x1: int, y1: int, x2: int, y2: int, cx: int, cy: int): None
  +draw_spaces(frame: ndarray, occupancy: dict[str, int], polygons: dict[str, ndarray]): None
}

class VideoProcessor {
  +process_video(camera_id: str, stream_url: str, model: YOLO, class_list: list[str], polygons: dict[str, ndarray], device: str): None
}

VideoProcessor --> ConfigLoader : carga configuración
VideoProcessor --> AreasLoader : obtiene áreas
VideoProcessor --> ModelLoader : inicializa modelo
VideoProcessor --> DeviceSelector : selecciona dispositivo
VideoProcessor --> InferenceEngine : delega inferencia
VideoProcessor --> DrawingToolkit : renderiza resultados
InferenceEngine --> ModelLoader : usa clases detectables
DrawingToolkit --> AreasLoader : requiere polígonos

@enduml
```

### Video Stream Service

```plantuml
@startuml

skinparam classAttributeIconSize 0

class StreamConfig {
  +VIDEO_PATHS: dict[str, str]
  ..
  +get(camera_id: str): str | None
}

class StreamUtils {
  +build_mjpeg_frame(jpeg_bytes: bytes): bytes
}

class CameraManager {
  +generate_mjpeg_stream(video_path: str): Iterator[bytes]
}

class VideoStreamApp {
  +stream_camera(camera_id: str): StreamingResponse
}

VideoStreamApp --> StreamConfig : consulta rutas
VideoStreamApp --> CameraManager : inicia streaming
CameraManager --> StreamUtils : empaqueta frames
CameraManager --> StreamConfig : requiere ruta video

@enduml
```

### Occupancy Service

```plantuml
@startuml

skinparam classAttributeIconSize 0

class RedisConnector {
  +host: str
  +port: int
  +db: int
  ..
  +get(key: str): bytes | None
}

class JWTGuard {
  +verify_jwt(token: HTTPAuthorizationCredentials): dict
}

class OccupancyPayload {
  +areas: dict[str, int]
  +summary: dict[str, int]
  ..
  +summarize(): dict[str, int]
}

class OccupancyServiceApp {
  +occupancy_ws(websocket: WebSocket, camera_id: str, token: str | None): Coroutine
  +get_occupancy(camera_id: str, user: dict): dict
}

OccupancyServiceApp --> RedisConnector : consulta datos
OccupancyServiceApp --> JWTGuard : valida token
OccupancyServiceApp --> OccupancyPayload : produce respuesta
OccupancyPayload --> RedisConnector : reconstruye áreas
JWTGuard --> RedisConnector : verifica revocación

@enduml
```

### Front-End Service

```plantuml
@startuml

skinparam classAttributeIconSize 0

class App {
  +cameraId: string
  +token: string | null
  +role: string | null
  +darkMode: boolean
  ..
  +handleLogin(newToken: string): Promise<void>
  +handleLogout(): void
  +setDarkMode(value: boolean): void
  +getRole(token: string): Promise<string>
}

class Login {
  +onLogin: (token: string) => void
  +email: string
  +password: string
  +error: string
  +loading: boolean
  +showRegister: boolean
  ..
  +handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void>
  +setShowRegister(value: boolean): void
}

class Register {
  +onBack: () => void
  +email: string
  +password: string
  +confirm: string
  +fieldErrors: Record<string, string>
  +globalMessage: { type: 'success' | 'error'; text: string } | null
  ..
  +validate(): Record<string, string>
  +handleRegister(e: FormEvent<HTMLFormElement>): Promise<void>
}

class Occupancy {
  +cameraId: string
  +token: string
  +darkMode: boolean | undefined
  +data: any
  +error: string
  +animatedOccupied: number
  +animatedFree: number
  ..
  +speakAvailability(free: number): void
  +getSummaryColor(free: number, dark: boolean): string
  +useEffect(getOccupancy & listenWebSocket): void
}

class VideoStream {
  +cameraId: string
  +token: string
  +darkMode: boolean
  +imgRef: MutableRefObject<HTMLImageElement | null>
  +mode: 'processed' | 'original'
  +maximized: boolean
  ..
  +useEffect(connectWebSocket): void
  +setMode(value: 'processed' | 'original'): void
  +setMaximized(value: boolean): void
}

class Footer {
  +darkMode: boolean
  +sx: SxProps | undefined
  ..
  +render(): JSX.Element
}

class AuthAPI {
  +login(email: string, password: string): Promise<string>
  +getRole(token: string): Promise<string>
}

class RegisterAPI {
  +register(email: string, password: string): Promise<void>
}

class OccupancyAPI {
  +getOccupancy(cameraId: string, token: string): Promise<any>
}

class VideoAPI {
  +getVideoStream(cameraId: string, mode: 'processed' | 'original'): string
}

App --> Login : compone
App --> Register : muestra modal
App --> Occupancy : renderiza
App --> VideoStream : controla
App --> Footer : incluye
Login --> AuthAPI : usa
Register --> RegisterAPI : utiliza
Occupancy --> OccupancyAPI : consulta
Occupancy --> VideoAPI : abre socket
VideoStream --> VideoAPI : obtiene URL
VideoStream --> OccupancyAPI : sincroniza métricas
Footer --> App : recibe props

@enduml
```
