import { Graphi } from '@/Graphi';
import { Attributes } from 'graphology-types';


export type LayoutMapping = { [key: string]: { x: number; y: number } };

export type State = "active" | "normal" | "inactive"

export type BaseAttributes = Attributes & { hidden: boolean, state: State };
export type BaseNodeAttributes = BaseAttributes & { x: number, y: number };
export type BaseEdgeAttributes = BaseAttributes & { points?: { x: number, y: number }[] };

export interface Layout<O> {
    run(graphi: Graphi, options?: O): void
}

export interface SupervisedLayout<O> {
    tick(graph: Graph, options?: O): void
    stop(): void
}