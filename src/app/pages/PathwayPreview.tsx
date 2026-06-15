import { useState, useEffect } from 'react';
import { CaretRight as ChevronRight, Circle, CheckCircle as CheckCircle2, CalendarBlank as Calendar } from "@phosphor-icons/react";
import { loadModulesFromStorage, STORAGE_KEY, type Module } from './ModuleBuilderNew';

type GraduationStage = 'crisis' | 'stabilization' | 'growth';
type ModuleStatus = 'draft' | 'published';
type EngagementLevel = 'red' | 'yellow' | 'green';

interface ContentBlock {
  id: string;
  type: 'media' | 'multiple-choice' | 'text-input' | 'checkbox' | 'event';
  question?: string;
  eventId?: string;
  eventTitle?: string;
  eventEngagement?: EngagementLevel;
}

interface SubModule {
  id: string;
  title: string;
  description: string;
  contentBlocks: ContentBlock[];
  completed?: boolean;
}

interface ModuleItem {
  id: string;
  itemType: 'submodule' | 'event';
  order: number;
  subModule?: SubModule;
  eventBlock?: ContentBlock;
}

type ViewMode = 'stage-select' | 'module-list' | 'module-detail' | 'submodule-detail';

export default function PathwayPreview() {
  const [viewMode, setViewMode] = useState<ViewMode>('stage-select');
  const [selectedStage, setSelectedStage] = useState<GraduationStage | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSubModule, setSelectedSubModule] = useState<SubModule | null>(null);
  const [filterStatus, setFilterStatus] = useState<ModuleStatus | 'all'>('all');
  const [modules, setModules] = useState<Module[]>([]);

  // Load modules from storage
  useEffect(() => {
    const loadModules = () => {
      const loaded = loadModulesFromStorage();
      setModules(loaded);
    };

    loadModules();

    // Listen for updates from ModuleBuilder
    const handleStorageUpdate = () => {
      loadModules();
    };

    window.addEventListener('modules-updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('modules-updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const stages = [
    {
      id: 'crisis' as GraduationStage,
      title: 'Stage 1: Crisis Entry',
      subtitle: 'Survival & Immediate Needs',
      icon: '🔴',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:bg-red-100',
    },
    {
      id: 'stabilization' as GraduationStage,
      title: 'Stage 2: Stabilization',
      subtitle: 'Building Foundation & Safety',
      icon: '🟡',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      hoverColor: 'hover:bg-yellow-100',
    },
    {
      id: 'growth' as GraduationStage,
      title: 'Stage 3: Growth/Skill Building',
      subtitle: 'Independence & Mastery',
      icon: '🟢',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
    },
  ];

  const handleSelectStage = (stage: GraduationStage) => {
    setSelectedStage(stage);
    setViewMode('module-list');
  };

  const handleSelectModule = (module: Module) => {
    setSelectedModule(module);
    setViewMode('module-detail');
  };

  const handleSelectSubModule = (subModule: SubModule) => {
    setSelectedSubModule(subModule);
    setViewMode('submodule-detail');
  };

  const getCurrentStageModules = () => {
    const stageModules = modules.filter(m => m.stage === selectedStage);
    if (filterStatus === 'all') return stageModules;
    return stageModules.filter(m => m.status === filterStatus);
  };

  const getCurrentStageInfo = () => {
    return stages.find(s => s.id === selectedStage);
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'media': return '📹';
      case 'multiple-choice': return '☑️';
      case 'text-input': return '✍️';
      case 'checkbox': return '☐';
      case 'event': return '📅';
      default: return '•';
    }
  };

  const getEventColor = (engagement?: EngagementLevel) => {
    switch (engagement) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const renderBreadcrumbs = () => {
    const crumbs = [];
    
    if (viewMode === 'module-list' && selectedStage) {
      const stageInfo = getCurrentStageInfo();
      crumbs.push(
        <div key="stage" className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('stage-select')}
            className="text-gray-500 hover:text-gray-700"
          >
            Stages
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{stageInfo?.icon} {stageInfo?.title}</span>
        </div>
      );
    }
    
    if (viewMode === 'module-detail' && selectedModule) {
      const stageInfo = getCurrentStageInfo();
      crumbs.push(
        <div key="module" className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('stage-select')}
            className="text-gray-500 hover:text-gray-700"
          >
            Stages
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => setViewMode('module-list')}
            className="text-gray-500 hover:text-gray-700"
          >
            {stageInfo?.icon} {stageInfo?.title}
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{selectedModule.title}</span>
        </div>
      );
    }
    
    if (viewMode === 'submodule-detail' && selectedSubModule) {
      const stageInfo = getCurrentStageInfo();
      crumbs.push(
        <div key="submodule" className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('stage-select')}
            className="text-gray-500 hover:text-gray-700"
          >
            Stages
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => setViewMode('module-list')}
            className="text-gray-500 hover:text-gray-700"
          >
            {stageInfo?.icon} {stageInfo?.title}
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => setViewMode('module-detail')}
            className="text-gray-500 hover:text-gray-700"
          >
            {selectedModule?.title}
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{selectedSubModule.title}</span>
        </div>
      );
    }
    
    return <div className="mb-6">{crumbs}</div>;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pathway Preview</h1>
        <p className="text-gray-500">Browse the learning journey: Stage → Module → Sub-modules/Content</p>
      </div>

      {/* Breadcrumbs */}
      {renderBreadcrumbs()}

      {/* View 1: Stage Selection */}
      {viewMode === 'stage-select' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a Graduation Stage</h2>
          <div className="grid grid-cols-3 gap-6">
            {stages.map(stage => {
              const stageModules = modules.filter(m => m.stage === stage.id);
              const publishedCount = stageModules.filter(m => m.status === 'published').length;
              const draftCount = stageModules.filter(m => m.status === 'draft').length;
              const totalSubModules = stageModules.reduce((sum, m) => 
                sum + (m.moduleItems?.filter((i: ModuleItem) => i.itemType === 'submodule').length || 0), 0
              );
              const totalEvents = stageModules.reduce((sum, m) => 
                sum + (m.moduleItems?.filter((i: ModuleItem) => i.itemType === 'event').length || 0), 0
              );
              
              return (
                <button
                  key={stage.id}
                  onClick={() => handleSelectStage(stage.id)}
                  className={`p-6 rounded-lg border-2 ${stage.borderColor} ${stage.bgColor} ${stage.hoverColor} transition-all text-left`}
                >
                  <div className="text-4xl mb-3">{stage.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{stage.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{stage.subtitle}</p>
                  <div className="space-y-1 pt-4 border-t border-gray-300">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Published:</span>
                      <span className="font-semibold text-green-700">{publishedCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Drafts:</span>
                      <span className="font-semibold text-gray-700">{draftCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sub-modules:</span>
                      <span className="font-semibold text-gray-900">{totalSubModules}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Module List */}
      {viewMode === 'module-list' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {getCurrentStageInfo()?.icon} {getCurrentStageInfo()?.title} Modules
              </h2>
              <p className="text-gray-500 mt-1">{getCurrentStageModules().length} modules</p>
            </div>
            
            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded text-sm border ${
                  filterStatus === 'all'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('published')}
                className={`px-3 py-1.5 rounded text-sm border ${
                  filterStatus === 'published'
                    ? 'border-green-600 bg-green-50 text-green-700 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setFilterStatus('draft')}
                className={`px-3 py-1.5 rounded text-sm border ${
                  filterStatus === 'draft'
                    ? 'border-gray-600 bg-gray-50 text-gray-700 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Drafts
              </button>
            </div>
          </div>

          {getCurrentStageModules().length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No modules match your filter</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {getCurrentStageModules().map(module => {
                const subModuleCount = module.moduleItems?.filter((i: ModuleItem) => i.itemType === 'submodule').length || 0;
                const eventCount = module.moduleItems?.filter((i: ModuleItem) => i.itemType === 'event').length || 0;
                
                return (
                  <div
                    key={module.id}
                    onClick={() => handleSelectModule(module)}
                    className="p-5 bg-white border border-gray-200 rounded-lg hover:border-brand-500 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            module.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {module.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                            {module.pillar}
                          </span>
                          <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-xs font-medium">
                            {module.seedsReward} seeds
                          </span>
                          {module.badgeUnlock && (
                            <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-xs">
                              🏆 {module.badgeUnlock}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-gray-500">{subModuleCount} sub-modules</div>
                        <div className="text-sm text-gray-500">{eventCount} events</div>
                        <ChevronRight className="w-5 h-5 text-gray-400 mt-2 ml-auto" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* View 3: Module Detail */}
      {viewMode === 'module-detail' && selectedModule && (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{selectedModule.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedModule.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {selectedModule.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{selectedModule.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                {selectedModule.pillar}
              </span>
              <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
                {selectedModule.seedsReward} Seeds
              </span>
              {selectedModule.badgeUnlock && (
                <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm">
                  🏆 {selectedModule.badgeUnlock}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Module Structure ({selectedModule.moduleItems?.length || 0} items)
            </h3>
            {(!selectedModule.moduleItems || selectedModule.moduleItems.length === 0) ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-sm text-gray-500">No content in this module yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedModule.moduleItems
                  ?.sort((a: ModuleItem, b: ModuleItem) => a.order - b.order)
                  .map((item: ModuleItem, index: number) => (
                    <div key={item.id}>
                      {/* Sub-module Item */}
                      {item.itemType === 'submodule' && item.subModule && (
                        <div
                          onClick={() => handleSelectSubModule(item.subModule!)}
                          className="p-4 bg-brand-50 rounded-lg border border-brand-200 hover:border-brand-400 cursor-pointer transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <Circle className="w-5 h-5 text-brand-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-brand-600 text-white rounded text-xs font-medium">
                                  SUB-MODULE
                                </span>
                                <h4 className="text-base font-semibold text-gray-900">
                                  {item.subModule.title || 'Untitled'}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{item.subModule.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {item.subModule.contentBlocks.map((block: ContentBlock, blockIndex: number) => (
                                  <span
                                    key={block.id}
                                    className="px-2 py-0.5 bg-white border border-brand-300 rounded text-xs text-gray-600"
                                  >
                                    {getBlockIcon(block.type)} {block.type === 'event' ? 'Event' : `Q${blockIndex + 1}`}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{item.subModule.contentBlocks.length} blocks</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Event Item */}
                      {item.itemType === 'event' && item.eventBlock && (
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-orange-600 text-white rounded text-xs font-medium">
                              EVENT
                            </span>
                            <Calendar className="w-4 h-4 text-brand-600" />
                            <span className="text-sm font-medium">{item.eventBlock.eventTitle}</span>
                            <span className={`px-2 py-0.5 rounded text-xs text-white ${getEventColor(item.eventBlock.eventEngagement)}`}>
                              {item.eventBlock.eventEngagement}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 4: Sub-module Detail */}
      {viewMode === 'submodule-detail' && selectedSubModule && (
        <div>
          <div className="mb-6 flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Circle className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSubModule.title}</h2>
              <p className="text-gray-600">{selectedSubModule.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Content Blocks ({selectedSubModule.contentBlocks.length})
            </h3>
            {selectedSubModule.contentBlocks.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-sm text-gray-500">No content blocks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedSubModule.contentBlocks.map((block: ContentBlock, index: number) => (
                  <div key={block.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getBlockIcon(block.type)}</span>
                          <span className="text-xs font-medium text-gray-600 uppercase">{block.type}</span>
                        </div>
                        {block.question && (
                          <p className="text-sm text-gray-700 mt-2">{block.question}</p>
                        )}
                        {block.type === 'event' && block.eventTitle && (
                          <div className="mt-2 p-3 bg-brand-50 border border-brand-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-brand-700" />
                              <span className="text-sm font-medium text-brand-900">{block.eventTitle}</span>
                            </div>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs text-white ${getEventColor(block.eventEngagement)}`}>
                              {block.eventEngagement} engagement
                            </span>
                          </div>
                        )}
                        {block.type === 'media' && (
                          <div className="mt-2 p-3 bg-brand-50 border border-brand-200 rounded text-xs text-brand-700">
                            Media content block (video/audio)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}