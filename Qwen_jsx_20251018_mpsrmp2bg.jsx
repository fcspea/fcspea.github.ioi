import React, { useState, useEffect } from 'react';

const App = () => {
  // Initialize with sample data including Body Code and Phase
  const [projects, setProjects] = useState([
    {
      id: 1,
      picName: "John Doe",
      projectName: "Sample Project Alpha",
      projectCode: "SP-001",
      bodyCode: "BC-001",
      phase: "Phase 1",
      equipmentGroup: "Mechanical",
      equipmentSource: "Local Supplier",
      stages: [
        {
          name: '1. Concept',
          plannedStart: '2024-01-01',
          plannedEnd: '2024-01-15',
          actualStart: '2024-01-01',
          actualEnd: '2024-01-10',
          status: 'Completed',
          checkpoints: ["Define requirements", "Get approval", "Budget allocation"],
          completedCheckpoints: [0, 1, 2]
        },
        {
          name: '2. Tender Spec & Quotation',
          plannedStart: '2024-01-16',
          plannedEnd: '2024-01-31',
          actualStart: '2024-01-16',
          actualEnd: '',
          status: 'In Progress',
          checkpoints: ["Prepare specifications", "Send to vendors", "Evaluate quotes", "Select vendor"],
          completedCheckpoints: [0, 1, 2]
        },
        {
          name: '3. T Procure & PO',
          plannedStart: '2024-02-01',
          plannedEnd: '2024-02-15',
          actualStart: '',
          actualEnd: '',
          status: 'Delayed',
          checkpoints: ["Create PO", "Send to vendor", "Confirm delivery date"],
          completedCheckpoints: []
        }
      ].concat(Array.from({length: 8}, (_, i) => ({
        name: `${i + 4}. ${['Drawing', 'Fabrication', 'PDI', 'Shipping & Tax', 'Delivery', 'Installation', 'Trial', 'Handover'][i] || ''}`,
        plannedStart: '',
        plannedEnd: '',
        actualStart: '',
        actualEnd: '',
        status: 'Not Started',
        checkpoints: [],
        completedCheckpoints: []
      }))),
      createdAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 2,
      picName: "Jane Smith",
      projectName: "Sample Project Beta",
      projectCode: "SP-002",
      bodyCode: "BC-002",
      phase: "Phase 2",
      equipmentGroup: "Electrical",
      equipmentSource: "International Supplier",
      stages: [
        {
          name: '1. Concept',
          plannedStart: '2024-01-05',
          plannedEnd: '2024-01-20',
          actualStart: '2024-01-05',
          actualEnd: '2024-01-18',
          status: 'Completed',
          checkpoints: ["Define requirements", "Get approval", "Budget allocation"],
          completedCheckpoints: [0, 1, 2]
        },
        {
          name: '2. Tender Spec & Quotation',
          plannedStart: '2024-01-21',
          plannedEnd: '2024-02-05',
          actualStart: '2024-01-21',
          actualEnd: '2024-02-03',
          status: 'Completed',
          checkpoints: ["Prepare specifications", "Send to vendors", "Evaluate quotes", "Select vendor"],
          completedCheckpoints: [0, 1, 2, 3]
        },
        {
          name: '3. T Procure & PO',
          plannedStart: '2024-02-06',
          plannedEnd: '2024-02-20',
          actualStart: '2024-02-06',
          actualEnd: '2024-02-18',
          status: 'Completed',
          checkpoints: ["Create PO", "Send to vendor", "Confirm delivery date"],
          completedCheckpoints: [0, 1, 2]
        }
      ].concat(Array.from({length: 8}, (_, i) => ({
        name: `${i + 4}. ${['Drawing', 'Fabrication', 'PDI', 'Shipping & Tax', 'Delivery', 'Installation', 'Trial', 'Handover'][i] || ''}`,
        plannedStart: '',
        plannedEnd: '',
        actualStart: '',
        actualEnd: '',
        status: 'Not Started',
        checkpoints: [],
        completedCheckpoints: []
      }))),
      createdAt: new Date('2024-01-05').toISOString()
    },
    {
      id: 3,
      picName: "Mike Johnson",
      projectName: "Sample Project Gamma",
      projectCode: "SP-003",
      bodyCode: "BC-003",
      phase: "Phase 3",
      equipmentGroup: "Mechanical",
      equipmentSource: "Local Supplier",
      stages: Array.from({length: 11}, (_, i) => ({
        name: `${i + 1}. ${['Concept', 'Tender Spec & Quotation', 'T Procure & PO', 'Drawing', 'Fabrication', 'PDI', 'Shipping & Tax', 'Delivery', 'Installation', 'Trial', 'Handover'][i]}`,
        plannedStart: '',
        plannedEnd: '',
        actualStart: '',
        actualEnd: '',
        status: 'Not Started',
        checkpoints: [],
        completedCheckpoints: []
      })),
      createdAt: new Date('2024-01-10').toISOString()
    }
  ]);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showDailyTarget, setShowDailyTarget] = useState(false);
  const [dailyTargets, setDailyTargets] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState({ group: '', pic: '', status: '', bodyCode: '', phase: '' });
  const [showVisualization, setShowVisualization] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [notification, setNotification] = useState('');
  const [showExportData, setShowExportData] = useState(false);
  const [exportContent, setExportContent] = useState('');
  const [exportFileName, setExportFileName] = useState('');
  const [formData, setFormData] = useState({
    picName: '',
    projectName: '',
    projectCode: '',
    bodyCode: '',
    phase: '',
    equipmentGroup: '',
    equipmentSource: ''
  });
  const [showStageGraph, setShowStageGraph] = useState(false);
  const [selectedStageIndex, setSelectedStageIndex] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'delayed', 'in-progress', 'completed'

  const stages = [
    '1. Concept',
    '2. Tender Spec & Quotation',
    '3. T Procure & PO',
    '4. Drawing',
    '5. Fabrication',
    '6. PDI',
    '7. Shipping & Tax',
    '8. Delivery',
    '9. Installation',
    '10. Trial',
    '11. Handover'
  ];

  // Update current date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date().toISOString().split('T')[0]);
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Simple notification system
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new project - Simplified and reliable version
  const handleAddProject = () => {
    try {
      // Validate required fields
      if (!formData.picName.trim() || 
          !formData.projectName.trim() || 
          !formData.projectCode.trim() || 
          !formData.bodyCode.trim() || 
          !formData.phase.trim() || 
          !formData.equipmentGroup.trim() || 
          !formData.equipmentSource.trim()) {
        showNotification("Please fill in all required fields!");
        return;
      }
      
      // Create new project with all stages
      const newProject = {
        id: Date.now(),
        ...formData,
        stages: stages.map(stage => ({
          name: stage,
          plannedStart: '',
          plannedEnd: '',
          actualStart: '',
          actualEnd: '',
          status: 'Not Started',
          checkpoints: [],
          completedCheckpoints: []
        })),
        createdAt: new Date().toISOString()
      };
      
      // Add to projects array
      setProjects(prev => [...prev, newProject]);
      
      // Reset form and close modal
      setFormData({
        picName: '',
        projectName: '',
        projectCode: '',
        bodyCode: '',
        phase: '',
        equipmentGroup: '',
        equipmentSource: ''
      });
      setShowAddProject(false);
      
      showNotification("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      showNotification("Error creating project: " + error.message);
    }
  };

  // Edit project
  const handleEditProject = () => {
    try {
      if (!editingProject) return;
      
      // Validate required fields
      if (!formData.picName.trim() || 
          !formData.projectName.trim() || 
          !formData.projectCode.trim() || 
          !formData.bodyCode.trim() || 
          !formData.phase.trim() || 
          !formData.equipmentGroup.trim() || 
          !formData.equipmentSource.trim()) {
        showNotification("Please fill in all required fields!");
        return;
      }
      
      // Update project
      setProjects(prev => 
        prev.map(p => 
          p.id === editingProject.id 
            ? { ...p, ...formData }
            : p
        )
      );
      
      setShowEditProject(false);
      setEditingProject(null);
      setFormData({
        picName: '',
        projectName: '',
        projectCode: '',
        bodyCode: '',
        phase: '',
        equipmentGroup: '',
        equipmentSource: ''
      });
      
      showNotification("Project updated successfully!");
    } catch (error) {
      console.error("Error updating project:", error);
      showNotification("Error updating project: " + error.message);
    }
  };

  // Start editing a project
  const startEditingProject = (project) => {
    setEditingProject(project);
    setFormData({
      picName: project.picName,
      projectName: project.projectName,
      projectCode: project.projectCode,
      bodyCode: project.bodyCode,
      phase: project.phase,
      equipmentGroup: project.equipmentGroup,
      equipmentSource: project.equipmentSource
    });
    setShowEditProject(true);
  };

  // Delete project
  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
    if (selectedProject === projectId) {
      setSelectedProject(null);
    }
    showNotification("Project deleted successfully!");
  };

  // Confirm delete project
  const confirmDeleteProject = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  // Update stage dates
  const updateStageDates = (projectId, stageIndex, field, value) => {
    try {
      setProjects(prev => 
        prev.map(project => {
          if (project.id === projectId) {
            const updatedStages = [...project.stages];
            updatedStages[stageIndex] = {
              ...updatedStages[stageIndex],
              [field]: value
            };
            
            // Update status based on dates
            const stage = updatedStages[stageIndex];
            const today = new Date();
            
            if (stage.actualEnd) {
              updatedStages[stageIndex].status = 'Completed';
            } else if (stage.actualStart) {
              updatedStages[stageIndex].status = 'In Progress';
            } else if (stage.plannedStart && new Date(stage.plannedStart) <= today && !stage.actualStart) {
              updatedStages[stageIndex].status = 'Delayed';
            } else {
              updatedStages[stageIndex].status = 'Not Started';
            }
            
            return { ...project, stages: updatedStages };
          }
          return project;
        })
      );
    } catch (error) {
      console.error("Error updating stage dates:", error);
      showNotification("Error updating stage dates: " + error.message);
    }
  };

  // Add checkpoint to stage
  const addCheckpoint = (projectId, stageIndex, checkpointText) => {
    if (!checkpointText.trim()) return;
    
    try {
      setProjects(prev => 
        prev.map(project => {
          if (project.id === projectId) {
            const updatedStages = [...project.stages];
            updatedStages[stageIndex] = {
              ...updatedStages[stageIndex],
              checkpoints: [...updatedStages[stageIndex].checkpoints, checkpointText]
            };
            return { ...project, stages: updatedStages };
          }
          return project;
        })
      );
    } catch (error) {
      console.error("Error adding checkpoint:", error);
      showNotification("Error adding checkpoint: " + error.message);
    }
  };

  // Toggle checkpoint completion
  const toggleCheckpoint = (projectId, stageIndex, checkpointIndex) => {
    try {
      setProjects(prev => 
        prev.map(project => {
          if (project.id === projectId) {
            const updatedStages = [...project.stages];
            const stage = updatedStages[stageIndex];
            const completedCheckpoints = [...stage.completedCheckpoints];
            
            if (completedCheckpoints.includes(checkpointIndex)) {
              // Remove from completed
              const index = completedCheckpoints.indexOf(checkpointIndex);
              if (index > -1) {
                completedCheckpoints.splice(index, 1);
              }
            } else {
              // Add to completed
              completedCheckpoints.push(checkpointIndex);
            }
            
            updatedStages[stageIndex] = {
              ...stage,
              completedCheckpoints
            };
            
            return { ...project, stages: updatedStages };
          }
          return project;
        })
      );
    } catch (error) {
      console.error("Error toggling checkpoint:", error);
      showNotification("Error updating checkpoint: " + error.message);
    }
  };

  // Delete checkpoint
  const deleteCheckpoint = (projectId, stageIndex, checkpointIndex) => {
    try {
      setProjects(prev => 
        prev.map(project => {
          if (project.id === projectId) {
            const updatedStages = [...project.stages];
            const stage = updatedStages[stageIndex];
            
            // Remove checkpoint
            const newCheckpoints = stage.checkpoints.filter((_, index) => index !== checkpointIndex);
            
            // Update completed checkpoints
            const newCompletedCheckpoints = stage.completedCheckpoints
              .filter(index => index !== checkpointIndex)
              .map(index => index > checkpointIndex ? index - 1 : index);
            
            updatedStages[stageIndex] = {
              ...stage,
              checkpoints: newCheckpoints,
              completedCheckpoints: newCompletedCheckpoints
            };
            
            return { ...project, stages: updatedStages };
          }
          return project;
        })
      );
    } catch (error) {
      console.error("Error deleting checkpoint:", error);
      showNotification("Error deleting checkpoint: " + error.message);
    }
  };

  // Calculate project completion percentage
  const getProjectCompletion = (project) => {
    if (!project.stages.length) return 0;
    
    let totalCheckpoints = 0;
    let completedCheckpoints = 0;
    let completedStages = 0;
    
    project.stages.forEach(stage => {
      totalCheckpoints += stage.checkpoints.length;
      completedCheckpoints += stage.completedCheckpoints.length;
      
      if (stage.status === 'Completed') {
        completedStages++;
      }
    });
    
    // Calculate completion based on both stages and checkpoints
    const stageCompletion = (completedStages / project.stages.length) * 50; // 50% weight
    const checkpointCompletion = totalCheckpoints > 0 ? ((completedCheckpoints / totalCheckpoints) * 50) : 0; // 50% weight
    
    return Math.round(stageCompletion + checkpointCompletion);
  };

  // Get project status (Delayed if any stage is delayed, Completed if all stages completed, otherwise In Progress)
  const getProjectStatus = (project) => {
    // If any stage is delayed, the project is delayed
    if (project.stages.some(stage => stage.status === 'Delayed')) {
      return 'Delayed';
    }
    
    // If all stages are completed, the project is completed
    if (project.stages.every(stage => stage.status === 'Completed')) {
      return 'Completed';
    }
    
    // If no stages are started, the project is Not Started
    if (project.stages.every(stage => stage.status === 'Not Started')) {
      return 'Not Started';
    }
    
    // Otherwise, the project is In Progress
    return 'In Progress';
  };

  // Calculate overall stats
  const getOverallStats = () => {
    if (!projects.length) return { planned: 0, actual: 0, delayed: 0 };
    
    const totalStages = projects.length * stages.length;
    let completedStages = 0;
    let delayedStages = 0;
    let inProgressStages = 0;
    
    projects.forEach(project => {
      project.stages.forEach(stage => {
        if (stage.status === 'Completed') completedStages++;
        if (stage.status === 'Delayed') delayedStages++;
        if (stage.status === 'In Progress') inProgressStages++;
      });
    });
    
    const plannedCompletion = Math.round((completedStages / totalStages) * 100);
    const actualCompletion = Math.round(((completedStages + inProgressStages) / totalStages) * 100);
    const delayedPercentage = Math.round((delayedStages / totalStages) * 100);
    
    // Count projects by status
    const delayedProjects = projects.filter(p => getProjectStatus(p) === 'Delayed').length;
    const completedProjects = projects.filter(p => getProjectStatus(p) === 'Completed').length;
    const inProgressProjects = projects.filter(p => getProjectStatus(p) === 'In Progress').length;
    const notStartedProjects = projects.filter(p => getProjectStatus(p) === 'Not Started').length;
    
    return { 
      planned: plannedCompletion, 
      actual: actualCompletion, 
      delayed: delayedPercentage,
      totalProjects: projects.length,
      completedProjects,
      delayedProjects,
      inProgressProjects,
      notStartedProjects,
      totalCheckpoints: projects.reduce((sum, p) => sum + p.stages.reduce((s, stage) => s + stage.checkpoints.length, 0), 0),
      completedCheckpoints: projects.reduce((sum, p) => sum + p.stages.reduce((s, stage) => s + stage.completedCheckpoints.length, 0), 0)
    };
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.picName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.bodyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.phase.toLowerCase().includes(searchTerm.toLowerCase());
      
    const projectStatus = getProjectStatus(project);
    
    return matchesSearch && (
      (filter.group === '' || project.equipmentGroup === filter.group) &&
      (filter.pic === '' || project.picName === filter.pic) &&
      (filter.status === '' || filter.status === projectStatus) &&
      (filter.bodyCode === '' || project.bodyCode === filter.bodyCode) &&
      (filter.phase === '' || project.phase === filter.phase)
    );
  });

  // Get unique groups, PICs, Body Codes, and Phases for filtering
  const uniqueGroups = [...new Set(projects.map(p => p.equipmentGroup))];
  const uniquePics = [...new Set(projects.map(p => p.picName))];
  const uniqueBodyCodes = [...new Set(projects.map(p => p.bodyCode))];
  const uniquePhases = [...new Set(projects.map(p => p.phase))];
  const projectStatuses = ['All', 'Delayed', 'In Progress', 'Completed', 'Not Started'];

  // Generate CSV content
  const generateCSVContent = (exportType) => {
    try {
      let exportedProjects = [];
      
      switch(exportType) {
        case 'all':
          exportedProjects = projects;
          break;
        case 'filtered':
          exportedProjects = filteredProjects;
          break;
        case 'group':
          exportedProjects = filter.group ? projects.filter(p => p.equipmentGroup === filter.group) : projects;
          break;
        case 'pic':
          exportedProjects = filter.pic ? projects.filter(p => p.picName === filter.pic) : projects;
          break;
        case 'bodyCode':
          exportedProjects = filter.bodyCode ? projects.filter(p => p.bodyCode === filter.bodyCode) : projects;
          break;
        case 'phase':
          exportedProjects = filter.phase ? projects.filter(p => p.phase === filter.phase) : projects;
          break;
        default:
          exportedProjects = projects;
      }
      
      if (exportedProjects.length === 0) {
        showNotification("No projects to export.");
        return null;
      }
      
      // Create CSV content with proper escaping
      let csvContent = "";
      
      // Header row
      csvContent += [
        "Project Name",
        "Project Code",
        "Body Code",
        "Phase",
        "PIC Name",
        "Equipment Group",
        "Equipment Source",
        "Completion %",
        "Status",
        "Created Date"
      ].join(",") + "\r\n";
      
      // Data rows
      exportedProjects.forEach(project => {
        csvContent += [
          escapeCSVField(project.projectName),
          escapeCSVField(project.projectCode),
          escapeCSVField(project.bodyCode),
          escapeCSVField(project.phase),
          escapeCSVField(project.picName),
          escapeCSVField(project.equipmentGroup),
          escapeCSVField(project.equipmentSource),
          getProjectCompletion(project),
          getProjectStatus(project),
          new Date(project.createdAt).toLocaleDateString()
        ].join(",") + "\r\n";
        
        // Add stages data
        csvContent += [
          "Stage",
          "Planned Start",
          "Planned End",
          "Actual Start",
          "Actual End",
          "Status",
          "Checkpoints Completed",
          "Total Checkpoints"
        ].join(",") + "\r\n";
        
        project.stages.forEach(stage => {
          csvContent += [
            escapeCSVField(stage.name),
            escapeCSVField(stage.plannedStart),
            escapeCSVField(stage.plannedEnd),
            escapeCSVField(stage.actualStart),
            escapeCSVField(stage.actualEnd),
            escapeCSVField(stage.status),
            stage.completedCheckpoints.length,
            stage.checkpoints.length
          ].join(",") + "\r\n";
          
          // Add checkpoints if any
          if (stage.checkpoints.length > 0) {
            csvContent += ["Checkpoint", "Status"].join(",") + "\r\n";
            stage.checkpoints.forEach((checkpoint, index) => {
              csvContent += [
                escapeCSVField(checkpoint),
                stage.completedCheckpoints.includes(index) ? 'Completed' : 'Pending'
              ].join(",") + "\r\n";
            });
          }
          csvContent += "\r\n";
        });
        csvContent += "\r\n";
      });
      
      // Set filename
      const fileName = `Project_Monitoring_${new Date().toISOString().split('T')[0]}.csv`;
      
      return { content: csvContent, fileName };
    } catch (error) {
      console.error("Error generating CSV content:", error);
      showNotification("Error generating export  " + error.message);
      return null;
    }
  };

  // Helper function to escape CSV fields
  const escapeCSVField = (field) => {
    if (field == null) return "";
    const str = String(field);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  // Set daily target for project
  const setDailyTarget = (projectId, target) => {
    try {
      setDailyTargets(prev => ({
        ...prev,
        [projectId]: target
      }));
    } catch (error) {
      console.error("Error setting daily target:", error);
      showNotification("Error setting daily target: " + error.message);
    }
  };

  // Show export data
  const handleExportData = (exportType) => {
    const exportData = generateCSVContent(exportType);
    if (exportData) {
      setExportContent(exportData.content);
      setExportFileName(exportData.fileName);
      setShowExportData(true);
      setShowExportModal(false);
    }
  };

  // Generate combined stage graph data for all projects
  const generateCombinedStageGraphData = (stageIndex) => {
    const stageName = stages[stageIndex];
    
    // Get all projects that have data for this stage
    const projectsWithStageData = projects.filter(project => {
      const stage = project.stages[stageIndex];
      return stage.plannedStart || stage.actualStart;
    });
    
    if (projectsWithStageData.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    // Find the overall date range across all projects
    let minDate = null;
    let maxDate = null;
    
    projectsWithStageData.forEach(project => {
      const stage = project.stages[stageIndex];
      
      if (stage.plannedStart) {
        const date = new Date(stage.plannedStart);
        if (!minDate || date < minDate) minDate = new Date(date);
        if (!maxDate || date > maxDate) maxDate = new Date(date);
      }
      
      if (stage.plannedEnd) {
        const date = new Date(stage.plannedEnd);
        if (!maxDate || date > maxDate) maxDate = new Date(date);
      }
      
      if (stage.actualStart) {
        const date = new Date(stage.actualStart);
        if (!minDate || date < minDate) minDate = new Date(date);
        if (!maxDate || date > maxDate) maxDate = new Date(date);
      }
      
      if (stage.actualEnd) {
        const date = new Date(stage.actualEnd);
        if (!maxDate || date > maxDate) maxDate = new Date(date);
      }
    });
    
    if (!minDate || !maxDate) {
      return { labels: [], datasets: [] };
    }
    
    // Generate date labels (one per day)
    const labels = [];
    let currentDate = new Date(minDate);
    
    while (currentDate <= maxDate) {
      labels.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Generate datasets for each project
    const datasets = projectsWithStageData.map(project => {
      const stage = project.stages[stageIndex];
      const plannedData = [];
      const actualData = [];
      
      // Calculate planned completion percentage over time
      const plannedStart = stage.plannedStart ? new Date(stage.plannedStart) : null;
      const plannedEnd = stage.plannedEnd ? new Date(stage.plannedEnd) : null;
      const totalPlannedDays = plannedStart && plannedEnd ? Math.max(1, Math.ceil((plannedEnd - plannedStart) / (1000 * 60 * 60 * 24))) : 1;
      
      // Calculate actual completion
      const actualStart = stage.actualStart ? new Date(stage.actualStart) : null;
      const actualEnd = stage.actualEnd ? new Date(stage.actualEnd) : null;
      
      labels.forEach(dateStr => {
        const date = new Date(dateStr);
        
        // Planned completion
        if (plannedStart && plannedEnd) {
          if (date < plannedStart) {
            plannedData.push(0);
          } else if (date >= plannedEnd) {
            plannedData.push(100);
          } else {
            const daysPassed = Math.ceil((date - plannedStart) / (1000 * 60 * 60 * 24));
            const plannedPercent = Math.min(100, Math.max(0, (daysPassed / totalPlannedDays) * 100));
            plannedData.push(Math.round(plannedPercent));
          }
        } else {
          plannedData.push(0);
        }
        
        // Actual completion
        if (actualEnd && date >= actualEnd) {
          actualData.push(100);
        } else if (actualStart && date >= actualStart) {
          // If stage is in progress, show 50% until completed
          actualData.push(50);
        } else if (stage.status === 'Completed' && plannedEnd && date >= plannedEnd) {
          // If completed but no actual dates, show 100% after planned end date
          actualData.push(100);
        } else {
          actualData.push(0);
        }
      });
      
      return {
        projectName: project.projectName,
        plannedData,
        actualData,
        color: getRandomColor()
      };
    });
    
    return { labels, datasets };
  };

  // Helper function to generate random colors for graphs
  const getRandomColor = () => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
      '#84CC16', // lime
      '#F97316', // orange
      '#6366F1', // indigo
      '#14B8A6', // teal
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Show combined stage graph
  const handleShowCombinedStageGraph = (stageIndex) => {
    setSelectedStageIndex(stageIndex);
    setShowStageGraph(true);
  };

  // Download stage raw data for all projects
  const downloadCombinedStageRawData = (stageIndex) => {
    const stageName = stages[stageIndex];
    const graphData = generateCombinedStageGraphData(stageIndex);
    
    if (graphData.labels.length === 0) {
      showNotification("No data available for this stage.");
      return;
    }
    
    let csvContent = `Date,${graphData.datasets.map(d => `${d.projectName} (Planned),${d.projectName} (Actual)`).join(',')}\n`;
    
    for (let i = 0; i < graphData.labels.length; i++) {
      let row = graphData.labels[i];
      graphData.datasets.forEach(dataset => {
        row += `,${dataset.plannedData[i]},${dataset.actualData[i]}`;
      });
      csvContent += row + '\n';
    }
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `All_Projects_${stageName.replace(/[^a-z0-9]/gi, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification("Combined stage raw data downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Monitoring Dashboard</h1>
              <p className="text-sm text-gray-600">Track all your projects across 11 stages with checkpoints</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by name, code, PIC, Body Code, or Phase..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowAddProject(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Project
          </button>
          <button
            onClick={() => setShowDailyTarget(!showDailyTarget)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {showDailyTarget ? 'Hide Daily Targets' : 'Set Daily Targets'}
          </button>
          <button
            onClick={() => setShowVisualization(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Visualization
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Group</label>
              <select
                value={filter.group}
                onChange={(e) => setFilter({...filter, group: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Groups</option>
                {uniqueGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PIC</label>
              <select
                value={filter.pic}
                onChange={(e) => setFilter({...filter, pic: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All PICs</option>
                {uniquePics.map(pic => (
                  <option key={pic} value={pic}>{pic}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body Code</label>
              <select
                value={filter.bodyCode}
                onChange={(e) => setFilter({...filter, bodyCode: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Body Codes</option>
                {uniqueBodyCodes.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phase</label>
              <select
                value={filter.phase}
                onChange={(e) => setFilter({...filter, phase: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Phases</option>
                {uniquePhases.map(phase => (
                  <option key={phase} value={phase}>{phase}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Delayed">Delayed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Not Started">Not Started</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter({ group: '', pic: '', status: '', bodyCode: '', phase: '' });
                }}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Overall Project Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-blue-900">Total Projects</h3>
                  <div className="text-3xl font-bold text-blue-600 mt-1">{getOverallStats().totalProjects}</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-900">Completed</h3>
                  <div className="text-3xl font-bold text-green-600 mt-1">{getOverallStats().completedProjects}</div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-yellow-900">In Progress</h3>
                  <div className="text-3xl font-bold text-yellow-600 mt-1">
                    {getOverallStats().inProgressProjects}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-red-900">Delayed</h3>
                  <div className="text-3xl font-bold text-red-600 mt-1">{getOverallStats().delayedProjects}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-500">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Not Started</h3>
                  <div className="text-3xl font-bold text-gray-600 mt-1">{getOverallStats().notStartedProjects}</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-purple-900">Completion Rate</h3>
                  <div className="text-3xl font-bold text-purple-600 mt-1">{getOverallStats().actual}%</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Project Status Tabs */}
          <div className="mt-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                All Projects ({projects.length})
              </button>
              <button
                onClick={() => setViewMode('delayed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'delayed' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Delayed ({getOverallStats().delayedProjects})
              </button>
              <button
                onClick={() => setViewMode('in-progress')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'in-progress' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                In Progress ({getOverallStats().inProgressProjects})
              </button>
              <button
                onClick={() => setViewMode('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'completed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Completed ({getOverallStats().completedProjects})
              </button>
              <button
                onClick={() => setViewMode('not-started')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'not-started' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Not Started ({getOverallStats().notStartedProjects})
              </button>
            </div>
          </div>
        </div>

        {/* Daily Targets Section */}
        {showDailyTarget && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Targets</h2>
            <div className="space-y-6">
              {filteredProjects.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{project.projectName}</h3>
                      <p className="text-gray-600">PIC: {project.picName} | Code: {project.projectCode}</p>
                      <p className="text-sm text-gray-500">Body Code: {project.bodyCode} | Phase: {project.phase}</p>
                      <p className="text-sm text-gray-500">Group: {project.equipmentGroup} | Source: {project.equipmentSource}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{getProjectCompletion(project)}%</div>
                      <div className="text-sm text-gray-500">Project Completion</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Daily Target</label>
                      <input
                        type="text"
                        placeholder="What needs to be accomplished today?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={dailyTargets[project.id] || ''}
                        onChange={(e) => setDailyTarget(project.id, e.target.value)}
                      />
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap bg-gray-100 px-3 py-2 rounded-lg">
                      Today: {currentDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Combined Stage Graphs Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Stage Progress Overview (All Projects)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stages.map((stage, index) => {
              // Count projects by status for this stage
              const stageStats = {
                completed: 0,
                inProgress: 0,
                delayed: 0,
                notStarted: 0
              };
              
              projects.forEach(project => {
                const stageStatus = project.stages[index].status;
                if (stageStatus === 'Completed') stageStats.completed++;
                else if (stageStatus === 'In Progress') stageStats.inProgress++;
                else if (stageStatus === 'Delayed') stageStats.delayed++;
                else stageStats.notStarted++;
              });
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-gray-900 mb-2">{stage}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Completed:</span>
                      <span className="font-medium">{stageStats.completed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600">In Progress:</span>
                      <span className="font-medium">{stageStats.inProgress}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Delayed:</span>
                      <span className="font-medium">{stageStats.delayed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Not Started:</span>
                      <span className="font-medium">{stageStats.notStarted}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShowCombinedStageGraph(index)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      View Graph
                    </button>
                    <button
                      onClick={() => downloadCombinedStageRawData(index)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      Download Data
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Project List ({filteredProjects.filter(p => {
                const status = getProjectStatus(p);
                if (viewMode === 'all') return true;
                if (viewMode === 'delayed') return status === 'Delayed';
                if (viewMode === 'in-progress') return status === 'In Progress';
                if (viewMode === 'completed') return status === 'Completed';
                if (viewMode === 'not-started') return status === 'Not Started';
                return true;
              }).length} projects)
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredProjects.filter(p => {
                const status = getProjectStatus(p);
                if (viewMode === 'all') return true;
                if (viewMode === 'delayed') return status === 'Delayed';
                if (viewMode === 'in-progress') return status === 'In Progress';
                if (viewMode === 'completed') return status === 'Completed';
                if (viewMode === 'not-started') return status === 'Not Started';
                return true;
              }).length} of {projects.length} total projects
            </div>
          </div>
          
          {filteredProjects.filter(p => {
            const status = getProjectStatus(p);
            if (viewMode === 'all') return true;
            if (viewMode === 'delayed') return status === 'Delayed';
            if (viewMode === 'in-progress') return status === 'In Progress';
            if (viewMode === 'completed') return status === 'Completed';
            if (viewMode === 'not-started') return status === 'Not Started';
            return true;
          }).map(project => {
            const projectStatus = getProjectStatus(project);
            const statusColor = projectStatus === 'Delayed' ? 'bg-red-100 text-red-800' :
                               projectStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                               projectStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                               'bg-gray-100 text-gray-800';
            
            return (
              <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-900">{project.projectName}</h3>
                      <p className="text-gray-600">Project Code: {project.projectCode}</p>
                      <p className="text-gray-600">Body Code: {project.bodyCode} | Phase: {project.phase}</p>
                      <p className="text-sm text-gray-500">
                        PIC: {project.picName} | Group: {project.equipmentGroup} | Source: {project.equipmentSource}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{getProjectCompletion(project)}%</div>
                        <div className="text-sm text-gray-500">Project Completion</div>
                        <div className="mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            {projectStatus}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => startEditingProject(project)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDeleteProject(project)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="px-6 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                >
                  <div className="flex justify-center items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedProject === project.id ? 'Hide Details' : 'Show Project Details'}
                    </span>
                    <svg 
                      className={`w-4 h-4 ml-2 text-gray-700 transition-transform duration-200 ${selectedProject === project.id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {selectedProject === project.id && (
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left p-4 font-medium text-gray-700">Stage</th>
                            <th className="text-left p-4 font-medium text-gray-700">Planned Start</th>
                            <th className="text-left p-4 font-medium text-gray-700">Planned End</th>
                            <th className="text-left p-4 font-medium text-gray-700">Actual Start</th>
                            <th className="text-left p-4 font-medium text-gray-700">Actual End</th>
                            <th className="text-left p-4 font-medium text-gray-700">Checkpoints</th>
                            <th className="text-left p-4 font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.stages.map((stage, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-4 font-medium text-gray-900">{stage.name}</td>
                              <td className="p-4">
                                <input
                                  type="date"
                                  value={stage.plannedStart}
                                  onChange={(e) => updateStageDates(project.id, index, 'plannedStart', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                />
                              </td>
                              <td className="p-4">
                                <input
                                  type="date"
                                  value={stage.plannedEnd}
                                  onChange={(e) => updateStageDates(project.id, index, 'plannedEnd', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                />
                              </td>
                              <td className="p-4">
                                <input
                                  type="date"
                                  value={stage.actualStart}
                                  onChange={(e) => updateStageDates(project.id, index, 'actualStart', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                />
                              </td>
                              <td className="p-4">
                                <input
                                  type="date"
                                  value={stage.actualEnd}
                                  onChange={(e) => updateStageDates(project.id, index, 'actualEnd', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                />
                              </td>
                              <td className="p-4">
                                <div className="space-y-2">
                                  {/* Add new checkpoint */}
                                  <div className="flex space-x-2">
                                    <input
                                      type="text"
                                      placeholder="Add checkpoint..."
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          addCheckpoint(project.id, index, e.target.value);
                                          e.target.value = '';
                                        }
                                      }}
                                      className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm flex-1"
                                    />
                                  </div>
                                  
                                  {/* List of checkpoints */}
                                  <div className="space-y-1 mt-2">
                                    {stage.checkpoints.map((checkpoint, cpIndex) => (
                                      <div key={cpIndex} className="flex items-center space-x-2">
                                        <input
                                          type="checkbox"
                                          checked={stage.completedCheckpoints.includes(cpIndex)}
                                          onChange={() => toggleCheckpoint(project.id, index, cpIndex)}
                                          className="w-4 h-4 text-blue-600 rounded"
                                        />
                                        <span className={`text-sm flex-1 ${stage.completedCheckpoints.includes(cpIndex) ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                          {checkpoint}
                                        </span>
                                        <button
                                          onClick={() => deleteCheckpoint(project.id, index, cpIndex)}
                                          className="text-red-500 hover:text-red-700 text-xs"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="text-xs text-gray-500 mt-1">
                                    {stage.completedCheckpoints.length}/{stage.checkpoints.length} completed
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                                  stage.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                  stage.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                  stage.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {stage.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Project Summary */}
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-3">Project Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {project.stages.filter(s => s.status === 'Completed').length}
                          </div>
                          <div className="text-sm text-gray-600">Completed Stages</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {project.stages.filter(s => s.status === 'In Progress').length}
                          </div>
                          <div className="text-sm text-gray-600">In Progress</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {project.stages.filter(s => s.status === 'Delayed').length}
                          </div>
                          <div className="text-sm text-gray-600">Delayed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-600">
                            {project.stages.filter(s => s.status === 'Not Started').length}
                          </div>
                          <div className="text-sm text-gray-600">Not Started</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {project.stages.reduce((sum, s) => sum + s.checkpoints.length, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Total Checkpoints</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">
                            {project.stages.reduce((sum, s) => sum + s.completedCheckpoints.length, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Done Checkpoints</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No projects message */}
        {projects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg mt-8">
            <div className="text-gray-400 text-8xl mb-6">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Projects Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Get started by adding your first project to monitor progress across all 11 stages with checkpoints and planned vs actual tracking.</p>
            <button
              onClick={() => setShowAddProject(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              Add Your First Project
            </button>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Project</h2>
              <button
                onClick={() => setShowAddProject(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PIC Name</label>
                  <input
                    type="text"
                    name="picName"
                    value={formData.picName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter PIC name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Code</label>
                  <input
                    type="text"
                    name="projectCode"
                    value={formData.projectCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter project code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Code</label>
                  <input
                    type="text"
                    name="bodyCode"
                    value={formData.bodyCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter body code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phase</label>
                  <input
                    type="text"
                    name="phase"
                    value={formData.phase}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Group</label>
                  <input
                    type="text"
                    name="equipmentGroup"
                    value={formData.equipmentGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter equipment group"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Source</label>
                  <input
                    type="text"
                    name="equipmentSource"
                    value={formData.equipmentSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter equipment source"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 pt-2">
                <button
                  onClick={() => setShowAddProject(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProject}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors transform hover:scale-105"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProject && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
              <button
                onClick={() => {
                  setShowEditProject(false);
                  setEditingProject(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PIC Name</label>
                  <input
                    type="text"
                    name="picName"
                    value={formData.picName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Code</label>
                  <input
                    type="text"
                    name="projectCode"
                    value={formData.projectCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Code</label>
                  <input
                    type="text"
                    name="bodyCode"
                    value={formData.bodyCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-3