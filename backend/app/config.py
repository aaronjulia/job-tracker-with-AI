from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DB_URL: str
    JWT_SECRET_KEY: str
    ALGORITHM: str = "HS256"
    TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    TEST_DB_URL: str | None = None
    OPENAI_API_KEY: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
