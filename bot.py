import os
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command

# Токен из переменных окружения
TOKEN = os.getenv("BOT_TOKEN")

bot = Bot(token=TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def start(message: types.Message):
    await message.answer("🚀 Бот работает через Railway!")

@dp.message()
async def echo(message: types.Message):
    await message.answer(f"Вы написали: {message.text}")

async def main():
    print("Бот запущен")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
