import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Presentation, 
    Plus, 
    Trash2, 
    Eye,
    Folder as FolderIcon,
    Search,
    Grid,
    List,
    Calendar,
    MoreVertical,
    Share2,
    Download
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Projects() {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedFolder, setSelectedFolder] = useState(null);
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me()
    });

    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['projects', user?.email],
        queryFn: () => base44.entities.Project.filter({ user_id: user?.id }, '-updated_date', 100),
        enabled: !!user
    });

    const { data: folders = [] } = useQuery({
        queryKey: ['folders', user?.email],
        queryFn: () => base44.entities.Folder.filter({ user_id: user?.id }, '-created_date', 50),
        enabled: !!user
    });

    const deleteProjectMutation = useMutation({
        mutationFn: (projectId) => base44.entities.Project.delete(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFolder = !selectedFolder || project.folder_id === selectedFolder;
        return matchesSearch && matchesFolder;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg">
                            <Presentation className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
                            <p className="text-slate-600">Manage your slide presentations</p>
                        </div>
                    </div>
                    <Link to={createPageUrl('Generator')}>
                        <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg">
                            <Plus className="w-5 h-5 mr-2" />
                            New Project
                        </Button>
                    </Link>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            onClick={() => setViewMode('grid')}
                            size="icon"
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            onClick={() => setViewMode('list')}
                            size="icon"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Folders */}
                {folders.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-sm font-semibold text-slate-700 mb-3">Folders</h2>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={!selectedFolder ? 'default' : 'outline'}
                                onClick={() => setSelectedFolder(null)}
                                size="sm"
                            >
                                All Projects
                            </Button>
                            {folders.map(folder => (
                                <Button
                                    key={folder.id}
                                    variant={selectedFolder === folder.id ? 'default' : 'outline'}
                                    onClick={() => setSelectedFolder(folder.id)}
                                    size="sm"
                                >
                                    <FolderIcon className="w-4 h-4 mr-2" />
                                    {folder.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Grid/List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <Card className="border-dashed border-2">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <Presentation className="w-16 h-16 text-slate-300 mb-4" />
                            <p className="text-xl text-slate-600 mb-2">No projects yet</p>
                            <p className="text-slate-500 mb-6">Create your first slide deck to get started</p>
                            <Link to={createPageUrl('Generator')}>
                                <Button className="bg-indigo-600 hover:bg-indigo-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Project
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Card className="hover:shadow-lg transition-all cursor-pointer group">
                                        <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                                            {project.thumbnail_url ? (
                                                <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <Presentation className="w-12 h-12 text-indigo-400" />
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                        </div>
                                        <CardHeader className="p-4">
                                            <CardTitle className="text-base line-clamp-1">{project.title}</CardTitle>
                                            {project.description && (
                                                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{project.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(project.updated_date), 'MMM d')}
                                                </span>
                                                <span>{project.slide_count || 0} slides</span>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <Button size="sm" variant="outline" className="flex-1">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Delete this project?')) {
                                                            deleteProjectMutation.mutate(project.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredProjects.map((project) => (
                            <Card key={project.id} className="hover:shadow-md transition-all">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-16 h-16 rounded bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                            <Presentation className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{project.title}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                                <span>{project.slide_count || 0} slides</span>
                                                <span>Updated {format(new Date(project.updated_date), 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                if (confirm('Delete this project?')) {
                                                    deleteProjectMutation.mutate(project.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}