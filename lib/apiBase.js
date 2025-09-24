const DEFAULT_API_BASE = "/api";

function normalizeBasePath(value) {
  if (!value || value === "/") {
    return "";
  }

  const withLeading = value.startsWith("/") ? value : `/${value}`;
  return withLeading.endsWith("/") ? withLeading.slice(0, -1) : withLeading;
}

function getBrowserBasePath() {
  if (typeof window === "undefined") {
    return undefined;
  }
  const data = window.__NEXT_DATA__;
  return normalizeBasePath(data?.config?.basePath);
}

function joinBasePath(basePath, path) {
  const normalizedBase = normalizeBasePath(basePath);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!normalizedBase) {
    return normalizedPath;
  }

  if (
    normalizedPath === normalizedBase ||
    normalizedPath.startsWith(`${normalizedBase}/`)
  ) {
    return normalizedPath;
  }

  if (normalizedPath === "/") {
    return normalizedBase || "/";
  }

  return `${normalizedBase}${normalizedPath}`;
}

function ensureAbsoluteIncludesBase(explicitBaseUrl, basePath) {
  try {
    const url = new URL(explicitBaseUrl);
    url.pathname = joinBasePath(basePath, url.pathname || "/");
    return url.toString();
  } catch (error) {
    return explicitBaseUrl;
  }
}

export function resolveApiBaseUrl(explicitBaseUrl, basePathEnv) {
  const detectedBasePath = getBrowserBasePath() ?? normalizeBasePath(basePathEnv);

  if (explicitBaseUrl) {
    if (/^https?:\/\//i.test(explicitBaseUrl)) {
      return ensureAbsoluteIncludesBase(explicitBaseUrl, detectedBasePath);
    }

    return joinBasePath(detectedBasePath, explicitBaseUrl);
  }

  return joinBasePath(detectedBasePath, DEFAULT_API_BASE);
}

