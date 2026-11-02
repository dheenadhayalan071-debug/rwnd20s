import React, { useEffect, useRef, useState } from 'react';

export interface ViewportOptions {
  once?: boolean;
  amount?: number;
  margin?: string;
}

export interface TransitionOptions {
  duration?: number;
  delay?: number;
  ease?: number[] | string;
}

export interface MotionProps extends React.HTMLAttributes<HTMLElement> {
  initial?: Record<string, unknown> | boolean;
  animate?: Record<string, unknown>;
  whileInView?: Record<string, unknown>;
  viewport?: ViewportOptions;
  exit?: Record<string, unknown>;
  transition?: TransitionOptions | Record<string, unknown>;
  layoutId?: string;
}

export const AnimatePresence: React.FC<{
  children: React.ReactNode;
  mode?: 'sync' | 'wait' | 'popLayout';
}> = ({ children }) => {
  return <>{children}</>;
};

function computeTransformStyle(
  targetState?: Record<string, unknown>,
  transition?: TransitionOptions | Record<string, unknown>,
  style?: React.CSSProperties
): React.CSSProperties {
  const durationMs =
    typeof transition?.duration === 'number'
      ? Math.round(transition.duration * 1000)
      : 520;
  const delayMs =
    typeof transition?.delay === 'number'
      ? Math.round(transition.delay * 1000)
      : 0;

  const merged: React.CSSProperties = {
    transition: `transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, width 320ms ease-out`,
    willChange: 'transform, opacity',
    ...style,
  };

  if (!targetState) return merged;

  if (typeof targetState.opacity === 'number') {
    merged.opacity = targetState.opacity;
  }
  if (
    typeof targetState.width === 'string' ||
    typeof targetState.width === 'number'
  ) {
    merged.width = targetState.width;
  }

  const transforms: string[] = [];
  if (typeof targetState.x === 'number' && targetState.x !== 0) {
    transforms.push(`translateX(${targetState.x}px)`);
  } else if (
    typeof targetState.x === 'string' &&
    targetState.x !== '0%' &&
    targetState.x !== '0px'
  ) {
    transforms.push(`translateX(${targetState.x})`);
  }

  if (typeof targetState.y === 'number' && targetState.y !== 0) {
    transforms.push(`translateY(${targetState.y}px)`);
  } else if (
    typeof targetState.y === 'string' &&
    targetState.y !== '0%' &&
    targetState.y !== '0px'
  ) {
    transforms.push(`translateY(${targetState.y})`);
  }

  if (typeof targetState.scale === 'number' && targetState.scale !== 1) {
    transforms.push(`scale(${targetState.scale})`);
  }

  merged.transform = transforms.length > 0 ? transforms.join(' ') : 'translateY(0px) scale(1)';

  return merged;
}

function useScrollRevealState(
  hasWhileInView: boolean,
  viewport?: ViewportOptions
): [React.RefObject<HTMLElement | null>, boolean] {
  const localRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(!hasWhileInView);

  useEffect(() => {
    if (!hasWhileInView) return;
    const node = localRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const threshold =
      typeof viewport?.amount === 'number' ? viewport.amount : 0.12;
    const rootMargin = viewport?.margin || '0px 0px -24px 0px';
    const once = viewport?.once !== false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasWhileInView, viewport?.amount, viewport?.margin, viewport?.once]);

  return [localRef, inView];
}

function assignCombinedRef<T extends HTMLElement>(
  forwardedRef: React.ForwardedRef<T>,
  localRef: React.MutableRefObject<HTMLElement | null>
) {
  return (node: T | null) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };
}

export const motion = {
  div: React.forwardRef<
    HTMLDivElement,
    MotionProps & React.HTMLAttributes<HTMLDivElement>
  >(
    (
      {
        initial,
        animate,
        whileInView,
        viewport,
        exit: _e,
        transition,
        layoutId: _l,
        style,
        children,
        ...rest
      },
      ref
    ) => {
      const [localRef, inView] = useScrollRevealState(
        Boolean(whileInView),
        viewport
      );
      const activeTarget = whileInView
        ? inView
          ? whileInView
          : typeof initial === 'object'
          ? initial
          : undefined
        : animate;

      return (
        <div
          ref={assignCombinedRef(ref, localRef)}
          style={computeTransformStyle(activeTarget, transition, style)}
          {...rest}
        >
          {children}
        </div>
      );
    }
  ),

  article: React.forwardRef<
    HTMLElement,
    MotionProps & React.HTMLAttributes<HTMLElement>
  >(
    (
      {
        initial,
        animate,
        whileInView,
        viewport,
        exit: _e,
        transition,
        layoutId: _l,
        style,
        children,
        ...rest
      },
      ref
    ) => {
      const [localRef, inView] = useScrollRevealState(
        Boolean(whileInView),
        viewport
      );
      const activeTarget = whileInView
        ? inView
          ? whileInView
          : typeof initial === 'object'
          ? initial
          : undefined
        : animate;

      return (
        <article
          ref={assignCombinedRef(ref, localRef)}
          style={computeTransformStyle(activeTarget, transition, style)}
          {...rest}
        >
          {children}
        </article>
      );
    }
  ),

  span: React.forwardRef<
    HTMLSpanElement,
    MotionProps & React.HTMLAttributes<HTMLSpanElement>
  >(
    (
      {
        initial: _i,
        animate,
        whileInView: _w,
        viewport: _v,
        exit: _e,
        transition,
        layoutId: _l,
        style,
        children,
        ...rest
      },
      ref
    ) => (
      <span
        ref={ref}
        style={computeTransformStyle(animate, transition, style)}
        {...rest}
      >
        {children}
      </span>
    )
  ),

  aside: React.forwardRef<
    HTMLElement,
    MotionProps & React.HTMLAttributes<HTMLElement>
  >(
    (
      {
        initial: _i,
        animate,
        whileInView: _w,
        viewport: _v,
        exit: _e,
        transition,
        layoutId: _l,
        style,
        children,
        ...rest
      },
      ref
    ) => (
      <aside
        ref={ref}
        style={computeTransformStyle(animate, transition, style)}
        {...rest}
      >
        {children}
      </aside>
    )
  ),

  button: React.forwardRef<
    HTMLButtonElement,
    MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>
  >(
    (
      {
        initial: _i,
        animate,
        whileInView: _w,
        viewport: _v,
        exit: _e,
        transition,
        layoutId: _l,
        style,
        children,
        ...rest
      },
      ref
    ) => (
      <button
        ref={ref}
        style={computeTransformStyle(animate, transition, style)}
        {...rest}
      >
        {children}
      </button>
    )
  ),

  svg: React.forwardRef<
    SVGSVGElement,
    MotionProps & React.SVGProps<SVGSVGElement>
  >(
    (
      {
        initial: _i,
        animate: _a,
        whileInView: _w,
        viewport: _v,
        exit: _e,
        transition: _t,
        layoutId: _l,
        className = '',
        children,
        ...rest
      },
      ref
    ) => (
      <svg ref={ref} className={`y2k-starburst-pulse ${className}`} {...rest}>
        {children}
      </svg>
    )
  ),
};
