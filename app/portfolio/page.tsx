'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Github,
  ExternalLink,
  Code,
  Star,
  Eye,
  Calendar,
  Tag,
  Folder,
  Play,
  Download,
  Share,
  Edit,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GameLayout } from '@/components/layout/game-layout';
import { useGameStore } from '@/lib/store';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  views: number;
  likes: number;
}

export default function PortfolioPage() {
  const { addNotification } = useGameStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: '',
    technologies: '',
    demo_url: '',
    github_url: '',
  });

  useEffect(() => {
    // Mock data for portfolio projects
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Personal Website',
        description: 'A responsive personal website built with React and Tailwind CSS',
        category: 'Web Development',
        technologies: ['React', 'Tailwind CSS', 'TypeScript'],
        image_url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
        demo_url: 'https://example.com',
        github_url: 'https://github.com/user/personal-website',
        status: 'published',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
        views: 245,
        likes: 18,
      },
      {
        id: '2',
        title: 'Todo App',
        description: 'A full-stack todo application with user authentication',
        category: 'Full Stack',
        technologies: ['Next.js', 'Node.js', 'MongoDB', 'JWT'],
        image_url: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
        demo_url: 'https://todo-app-demo.com',
        github_url: 'https://github.com/user/todo-app',
        status: 'published',
        created_at: '2024-02-01T09:00:00Z',
        updated_at: '2024-02-05T12:00:00Z',
        views: 189,
        likes: 24,
      },
      {
        id: '3',
        title: 'Weather Dashboard',
        description: 'A weather dashboard with real-time data and forecasts',
        category: 'Frontend',
        technologies: ['Vue.js', 'Chart.js', 'Weather API'],
        image_url: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
        demo_url: 'https://weather-dashboard-demo.com',
        status: 'draft',
        created_at: '2024-02-10T14:00:00Z',
        updated_at: '2024-02-12T16:45:00Z',
        views: 67,
        likes: 8,
      },
    ];

    setProjects(mockProjects);
    setIsLoading(false);
  }, []);

  const handleCreateProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: createForm.title,
      description: createForm.description,
      category: createForm.category,
      technologies: createForm.technologies.split(',').map(t => t.trim()),
      demo_url: createForm.demo_url,
      github_url: createForm.github_url,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views: 0,
      likes: 0,
    };

    setProjects([newProject, ...projects]);
    setCreateForm({
      title: '',
      description: '',
      category: '',
      technologies: '',
      demo_url: '',
      github_url: '',
    });
    setShowCreateDialog(false);

    addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Project Created!',
      message: 'Your project has been added to your portfolio',
    });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Project Deleted',
      message: 'Project has been removed from your portfolio',
    });
  };

  const handlePublishProject = (projectId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, status: 'published' as const } : p
    ));
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Project Published!',
      message: 'Your project is now visible to others',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web development':
        return 'bg-blue-100 text-blue-800';
      case 'mobile':
        return 'bg-green-100 text-green-800';
      case 'full stack':
        return 'bg-purple-100 text-purple-800';
      case 'frontend':
        return 'bg-cyan-100 text-cyan-800';
      case 'backend':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = {
    all: projects,
    published: projects.filter(p => p.status === 'published'),
    draft: projects.filter(p => p.status === 'draft'),
    archived: projects.filter(p => p.status === 'archived'),
  };

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading portfolio...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Portfolio</h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Showcase your coding projects and share your work with the community!
            </p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="mt-4 lg:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={createForm.title}
                      onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                      placeholder="My Awesome Project"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={createForm.category} onValueChange={(value) => setCreateForm({ ...createForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="Full Stack">Full Stack</SelectItem>
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="Game Development">Game Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Describe your project..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                  <Input
                    id="technologies"
                    value={createForm.technologies}
                    onChange={(e) => setCreateForm({ ...createForm, technologies: e.target.value })}
                    placeholder="React, TypeScript, Tailwind CSS"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="demo_url">Demo URL (optional)</Label>
                    <Input
                      id="demo_url"
                      value={createForm.demo_url}
                      onChange={(e) => setCreateForm({ ...createForm, demo_url: e.target.value })}
                      placeholder="https://your-demo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github_url">GitHub URL (optional)</Label>
                    <Input
                      id="github_url"
                      value={createForm.github_url}
                      onChange={(e) => setCreateForm({ ...createForm, github_url: e.target.value })}
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreateProject} className="flex-1">
                    Create Project
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{projects.length}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {projects.filter(p => p.status === 'published').length}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {projects.reduce((sum, p) => sum + p.views, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {projects.reduce((sum, p) => sum + p.likes, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Likes</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({filteredProjects.all.length})</TabsTrigger>
              <TabsTrigger value="published">Published ({filteredProjects.published.length})</TabsTrigger>
              <TabsTrigger value="draft">Draft ({filteredProjects.draft.length})</TabsTrigger>
              <TabsTrigger value="archived">Archived ({filteredProjects.archived.length})</TabsTrigger>
            </TabsList>

            {Object.entries(filteredProjects).map(([key, projectList]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <ProjectGrid 
                  projects={projectList} 
                  onDelete={handleDeleteProject}
                  onPublish={handlePublishProject}
                  onSelect={setSelectedProject}
                />
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Project Details Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Folder className="w-6 h-6 text-blue-600" />
                {selectedProject?.title}
              </DialogTitle>
            </DialogHeader>

            {selectedProject && (
              <div className="space-y-6">
                {/* Project Image */}
                {selectedProject.image_url && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedProject.image_url}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Project Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 mb-4">{selectedProject.description}</p>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedProject.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline">
                          <Tag className="w-3 h-3 mr-1" />
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(selectedProject.status)}>
                          {selectedProject.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Category:</span>
                        <Badge className={getCategoryColor(selectedProject.category)}>
                          {selectedProject.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Views:</span>
                        <span className="font-semibold">{selectedProject.views}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Likes:</span>
                        <span className="font-semibold">{selectedProject.likes}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-sm">
                          {new Date(selectedProject.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedProject.demo_url && (
                    <Button asChild>
                      <a href={selectedProject.demo_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Demo
                      </a>
                    </Button>
                  )}
                  {selectedProject.github_url && (
                    <Button variant="outline" asChild>
                      <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </GameLayout>
  );
}

// Project Grid Component
function ProjectGrid({ 
  projects, 
  onDelete, 
  onPublish, 
  onSelect 
}: { 
  projects: Project[], 
  onDelete: (id: string) => void,
  onPublish: (id: string) => void,
  onSelect: (project: Project) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web development':
        return 'bg-blue-100 text-blue-800';
      case 'mobile':
        return 'bg-green-100 text-green-800';
      case 'full stack':
        return 'bg-purple-100 text-purple-800';
      case 'frontend':
        return 'bg-cyan-100 text-cyan-800';
      case 'backend':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Folder className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
        <p className="text-gray-600">Start building your portfolio by adding your first project!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full">
            <CardContent className="p-0">
              {/* Project Image */}
              {project.image_url && (
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{project.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <Badge className={getCategoryColor(project.category)}>
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{project.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{project.likes}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onSelect(project)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  
                  {project.status === 'draft' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPublish(project.id)}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Publish
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}