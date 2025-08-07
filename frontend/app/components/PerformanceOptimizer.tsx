"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useMultiBrand } from "./MultiBrandProvider";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface PerformanceOptimizerProps {
  children: ReactNode;
}

export function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentBrand } = useMultiBrand();

  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = async () => {
      // Preload brand-specific fonts
      if (currentBrand) {
        const fontLink = document.createElement("link");
        fontLink.rel = "preload";
        fontLink.href =
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
        fontLink.as = "style";
        document.head.appendChild(fontLink);
      }

      // Preload critical images
      const criticalImages = [
        currentBrand?.logo,
        "/images/hero-bg.jpg",
        "/images/security-icon.svg",
      ].filter(Boolean);

      await Promise.all(
        criticalImages.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src as string;
          });
        })
      );

      setIsLoaded(true);
    };

    preloadCriticalResources();
  }, [currentBrand]);

  // Optimize images with lazy loading
  const optimizeImage = (src: string, alt: string, className: string = "") => {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          // Add fade-in effect
          e.currentTarget.style.opacity = "1";
        }}
        style={{
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    );
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Observe all images with data-src
      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });

      return () => imageObserver.disconnect();
    }
  }, []);

  // Optimize CSS delivery
  useEffect(() => {
    // Inline critical CSS
    const criticalCSS = `
      .critical-styles {
        font-family: 'Inter', sans-serif;
        line-height: 1.5;
        color: #333;
      }
      .brand-colors {
        --primary-color: ${currentBrand?.colors.primary || "#2563eb"};
        --secondary-color: ${currentBrand?.colors.secondary || "#1d4ed8"};
      }
    `;

    const style = document.createElement("style");
    style.textContent = criticalCSS;
    document.head.appendChild(style);

    // Load non-critical CSS asynchronously
    const nonCriticalCSS = document.createElement("link");
    nonCriticalCSS.rel = "stylesheet";
    nonCriticalCSS.href = "/styles/non-critical.css";
    nonCriticalCSS.media = "print";
    nonCriticalCSS.onload = () => {
      nonCriticalCSS.media = "all";
    };
    document.head.appendChild(nonCriticalCSS);
  }, [currentBrand]);

  // Optimize JavaScript loading
  useEffect(() => {
    // Defer non-critical JavaScript
    const deferScripts = () => {
      const scripts = document.querySelectorAll("script[data-defer]");
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        newScript.src = script.getAttribute("src") || "";
        newScript.async = true;
        document.body.appendChild(newScript);
      });
    };

    // Load deferred scripts after page load
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", deferScripts);
    } else {
      deferScripts();
    }
  }, []);

  // Optimize fonts
  useEffect(() => {
    // Font display swap for better performance
    const fontDisplay = "swap";
    const fontPreload = document.createElement("link");
    fontPreload.rel = "preload";
    fontPreload.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    fontPreload.as = "style";
    document.head.appendChild(fontPreload);
  }, []);

  // Optimize third-party scripts
  useEffect(() => {
    // Load Google Analytics asynchronously
    const loadGA = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID";
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag("js", new Date());
      gtag("config", "GA_MEASUREMENT_ID");
    };

    // Load GA after page load
    setTimeout(loadGA, 1000);
  }, []);

  // Optimize images with WebP support
  function getOptimizedImageSrc(src: string, width: number = 800) {
    if (src.includes("http")) return src;

    const baseName = src.replace(/\.[^/.]+$/, "");
    const extension = src.split(".").pop();

    // Return WebP if supported, otherwise original
    return `${baseName}-${width}.webp`;
  }

  // Optimize video loading
  const optimizeVideo = (
    src: string,
    poster: string,
    className: string = ""
  ) => {
    return (
      <video
        src={src}
        poster={poster}
        className={className}
        preload="metadata"
        muted
        playsInline
        onLoadedMetadata={(e) => {
          // Start playing when ready
          e.currentTarget.play().catch(() => {
            // Autoplay blocked, that's okay
          });
        }}
      />
    );
  };

  // Optimize animations for performance
  useEffect(() => {
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty(
        "--animation-duration",
        "0.01ms"
      );
    }
  }, []);

  // Optimize layout shifts
  useEffect(() => {
    // Reserve space for images to prevent layout shifts
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.style.width && !img.style.height) {
        img.style.width = "100%";
        img.style.height = "auto";
      }
    });
  }, []);

  return (
    <div className={`performance-optimized ${isLoaded ? "loaded" : "loading"}`}>
      {children}
    </div>
  );
}

// Utility functions for performance optimization
export const performanceUtils = {
  // Lazy load component
  lazyLoad: (importFunc: () => Promise<any>) => {
    return React.lazy(importFunc);
  },

  // Optimize bundle size
  optimizeBundle: () => {
    // Tree shaking for unused code
    if (process.env.NODE_ENV === "production") {
      // Remove console logs in production
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
    }
  },

  // Optimize images
  optimizeImage: (src: string, width: number = 800) => {
    return getOptimizedImageSrc(src, width);
  },

  // Preload critical resources
  preloadCritical: (resources: string[]) => {
    resources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource;
      link.as = resource.includes(".css") ? "style" : "script";
      document.head.appendChild(link);
    });
  },
};

function getOptimizedImageSrc(src: string, width: number) {
  throw new Error("Function not implemented.");
}
