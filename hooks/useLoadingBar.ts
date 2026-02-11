"use client";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 400 });

export function useLoadingBar(isLoading: boolean) {
    useEffect(() => {
        if (isLoading) {
            NProgress.start();
        } else {
            NProgress.done();
        }

        return () => {
            NProgress.done();
        };
    }, [isLoading]);
}