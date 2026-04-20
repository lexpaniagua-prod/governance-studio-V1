import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import IntelligenceLibrary from './components/modules/IntelligenceLibrary'
import SourceDrives from './components/modules/source-drives/SourceDrives'
import SandboxPlane from './components/modules/sandbox/SandboxPlane'
import SandboxDetail from './components/modules/sandbox/SandboxDetail'
import PromotionBuilder from './components/modules/sandbox/PromotionBuilder'
import TruthPlane from './components/modules/truth-plane/TruthPlane'
import TruthPlaneDetail from './components/modules/truth-plane/TruthPlaneDetail'
import TruthFactDetail from './components/modules/truth-plane/TruthFactDetail'
import Knowledge from './components/modules/knowledge/Knowledge'
import TruthPackDetail from './components/modules/knowledge/TruthPackDetail'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/intelligence-library" replace />} />
        <Route path="/intelligence-library" element={<IntelligenceLibrary />} />
        <Route path="/intelligence-library/source-drives" element={<SourceDrives />} />
        <Route path="/intelligence-library/knowledge" element={<Knowledge />} />
        <Route path="/intelligence-library/knowledge/:id" element={<TruthPackDetail />} />
        <Route path="/sandbox" element={<SandboxPlane />} />
        <Route path="/sandbox/:id" element={<SandboxDetail />} />
        <Route path="/sandbox/:id/promotion-builder" element={<PromotionBuilder />} />
        <Route path="/truth-plane" element={<TruthPlane />} />
        <Route path="/truth-plane/:id" element={<TruthPlaneDetail />} />
        <Route path="/truth-plane/:id/fact/:factId" element={<TruthFactDetail />} />
      </Routes>
    </Layout>
  )
}
