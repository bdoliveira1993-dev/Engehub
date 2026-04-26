
import React from 'react';

export enum EngineeringType {
  CIVIL = 'Civil',
  ELECTRICAL = 'Elétrica',
  MECHANICAL = 'Mecânica',
  CHEMICAL = 'Química',
  PRODUCTION = 'Produção',
  COMPUTER = 'Computação',
  ENVIRONMENTAL = 'Ambiental'
}

export enum ViewType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE',
  SERVICES = 'SERVICES',
  OPPORTUNITIES = 'OPPORTUNITIES',
  COURSES = 'COURSES',
  EVENTS = 'EVENTS',
  NEWS = 'NEWS',
  FORUM = 'FORUM',
  MESSAGES = 'MESSAGES'
}

export interface User {
  name: string;
  email: string;
  photo?: string;
  engineeringType?: EngineeringType;
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string }[];
}
