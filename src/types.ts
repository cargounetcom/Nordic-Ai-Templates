/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DynamicTheme = 'warm_scandinavian' | 'brutalist_copenhagen';

export interface TemplateProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  badge?: string;
  number?: string;
}

export interface GeneratedShopConfig {
  brandName: string;
  tagline: string;
  philosophy: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  fontStyle: 'serif' | 'monospace';
  layoutStyle: 'warm' | 'brutalist';
  products: TemplateProduct[];
}
