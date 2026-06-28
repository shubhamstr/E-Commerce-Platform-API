/* eslint-disable @typescript-eslint/no-require-imports */
// utils/logger.js

const consoleLogger = {
  info: (msg, src, meta) => console.log(`[INFO][${src || 'SYSTEM'}] ${msg}`, meta ? JSON.stringify(meta) : ""),
  warn: (msg, src, meta) => console.warn(`[WARN][${src || 'SYSTEM'}] ${msg}`, meta ? JSON.stringify(meta) : ""),
  error: (msg, src, meta) => console.error(`[ERROR][${src || 'SYSTEM'}] ${msg}`, meta ? JSON.stringify(meta) : ""),
}

const writeLog = async (level, message, source, meta) => {
  try {
    const { SystemLogs } = require("../models")
    let metaStr = null
    if (meta) {
      if (typeof meta === "object") {
        metaStr = JSON.stringify(meta)
      } else {
        metaStr = String(meta)
      }
    }
    await SystemLogs.create({
      level,
      message,
      source: source || "SYSTEM",
      meta: metaStr,
    })
  } catch (err) {
    console.error("logger failed to write to database:", err.message)
  }
}

const logger = {
  info: (message, source, meta) => {
    consoleLogger.info(message, source, meta)
    writeLog("info", message, source, meta)
  },
  warn: (message, source, meta) => {
    consoleLogger.warn(message, source, meta)
    writeLog("warn", message, source, meta)
  },
  error: (message, source, meta) => {
    consoleLogger.error(message, source, meta)
    writeLog("error", message, source, meta)
  },
}

module.exports = logger
