import type { Request, Response } from "express"

export const setRefreshCookie = (
  req: Request,
  res: Response,
  cookieName: string,
  token: string
) => {
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https"

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
}

export const clearAuthCookie = (
  req: Request,
  res: Response,
  cookieName: string
) => {

  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https"

  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    path: "/",
  })
}


export const setRefreshCookieAdmin = (
  req: Request,
  res: Response,
  cookieName: string,
  token: string
) => {
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https"

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    path: "/api/v1/admin",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
}

export const clearAuthCookieAdmin = (
  req: Request,
  res: Response,
  cookieName: string
) => {

  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https"

  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    path: "/api/v1/admin",
  })
}
