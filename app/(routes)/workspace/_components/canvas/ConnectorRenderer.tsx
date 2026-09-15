"use client";

import React from "react";
import type { Connector } from "./types";

interface ConnectorRendererProps {
  connector: Connector;
  sourcePoint: { x: number; y: number };
  targetPoint: { x: number; y: number };
  isSelected: boolean;
  onSelect: (e: React.PointerEvent) => void;
}

export default function ConnectorRenderer({
  connector,
  sourcePoint,
  targetPoint,
  isSelected,
  onSelect,
}: ConnectorRendererProps) {
  const handleClick = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(e);
  };

  const x1 = sourcePoint?.x || 0;
  const y1 = sourcePoint?.y || 0;
  const x2 = targetPoint?.x || 0;
  const y2 = targetPoint?.y || 0;

  return (
    <g className="group cursor-pointer">
      {/* Invisible broad hitbox for easy clicking/hovering */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="transparent"
        strokeWidth={16}
        className="pointer-events-auto"
        onPointerDown={handleClick}
      />

      {/* Selection Glow / Outline */}
      {isSelected && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={connector.type === "main-function" ? "#c084fc" : "#93c5fd"}
          strokeWidth={connector.type === "main-function" ? 8 : 6}
          strokeLinecap="round"
          className="pointer-events-none opacity-60"
        />
      )}

      {/* Visible Connector Line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={
          connector.type === "main-function"
            ? isSelected ? "#7c3aed" : "#8b5cf6"
            : connector.type === "main-output"
            ? isSelected ? "#16a34a" : "#22c55e"
            : isSelected ? "#2563eb" : "#64748b"
        }
        strokeWidth={
          connector.type === "main-function"
            ? isSelected ? 3.5 : 2.75
            : connector.type === "main-output"
            ? isSelected ? 3.5 : 2.75
            : isSelected ? 2.5 : 1.75
        }
        strokeLinecap="round"
        markerEnd={
          connector.type === "main-function"
            ? isSelected ? "url(#arrowhead-semantic-selected)" : "url(#arrowhead-semantic)"
            : connector.type === "main-output"
            ? isSelected ? "url(#arrowhead-output-selected)" : "url(#arrowhead-output)"
            : isSelected ? "url(#arrowhead-selected)" : "url(#arrowhead)"
        }
        className="pointer-events-none transition-colors"
      />

      {/* Semantic Connector Accent Track (Double line effect) */}
      {connector.type === "main-function" && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#f5f3ff"
          strokeWidth={0.8}
          strokeDasharray="4 4"
          strokeLinecap="round"
          className="pointer-events-none dark:stroke-slate-900"
        />
      )}

      {/* Source Anchor Dot */}
      <circle
        cx={x1}
        cy={y1}
        r={connector.type === "main-function" ? 4 : 3}
        fill={
          connector.type === "main-function"
            ? isSelected
              ? "#7c3aed"
              : "#8b5cf6"
            : isSelected
            ? "#2563eb"
            : "#64748b"
        }
        className="pointer-events-none transition-colors"
      />
    </g>
  );
}
