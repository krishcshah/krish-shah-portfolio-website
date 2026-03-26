import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { motion } from 'motion/react';
import { Edit2, Trash2, Plus, Eye, Save, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GoogleGenAI, Type } from '@google/genai';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  isPublished: boolean;
  tags: string[];
  publishedAt?: any;
}

export default function Admin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [publishedDate, setPublishedDate] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    let finalPublishedAt = isPublished ? (editingPost?.publishedAt || serverTimestamp()) : null;
    if (isPublished && publishedDate) {
      const parsedDate = new Date(publishedDate);
      if (!isNaN(parsedDate.getTime())) {
        finalPublishedAt = Timestamp.fromDate(parsedDate);
      }
    }

    const postData = {
      title,
      slug,
      content,
      excerpt,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isPublished,
      authorId: auth.currentUser.uid,
      publishedAt: finalPublishedAt
    };

    try {
      if (editingPost) {
        await updateDoc(doc(db, 'posts', editingPost.id), postData);
      } else {
        await addDoc(collection(db, 'posts'), postData);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Check console.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, 'posts', id));
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post.");
      }
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setExcerpt(post.excerpt || '');
    setTags((post.tags || []).join(', '));
    setIsPublished(post.isPublished || false);
    
    if (post.publishedAt) {
      // Convert firestore timestamp to YYYY-MM-DD
      const dateStr = post.publishedAt.toDate().toISOString().split('T')[0];
      setPublishedDate(dateStr);
    } else {
      setPublishedDate('');
    }
    
    setIsCreating(true);
  };

  const resetForm = () => {
    setEditingPost(null);
    setIsCreating(false);
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setTags('');
    setIsPublished(false);
    setPublishedDate('');
    setPreviewMode(false);
  };

  const handleRefineWithAI = async () => {
    if (!content) {
      alert("Please write some content first!");
      return;
    }
    setIsRefining(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert technical editor. Refine the following blog post.
      Fix grammar, spelling, and improve markdown formatting (spacing, readability).
      If the excerpt is poor or empty, generate a concise summary (max 3 sentences).
      If tags are empty, generate 3-5 relevant tags.
      
      Current Title: ${title}
      Current Excerpt: ${excerpt}
      Current Tags: ${tags}
      Current Content:
      ${content}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The refined title" },
              content: { type: Type.STRING, description: "The refined markdown content" },
              excerpt: { type: Type.STRING, description: "A concise summary excerpt" },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of relevant tags"
              }
            },
            required: ["title", "content", "excerpt", "tags"]
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        setTitle(result.title);
        setContent(result.content);
        setExcerpt(result.excerpt);
        setTags(result.tags.join(', '));
      }
    } catch (error) {
      console.error("AI Refinement error:", error);
      alert("Failed to refine with AI. Check console.");
    } finally {
      setIsRefining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#00FF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-12"
    >
      <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Command Center</h1>
          <p className="font-mono text-white/50 text-sm tracking-widest uppercase">Admin Dashboard</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 bg-[#00FF00] text-black px-6 py-3 font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors"
          >
            <Plus size={18} />
            <span>New Post</span>
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="max-w-4xl mx-auto">
          {/* Editor */}
          <div className={`space-y-6 ${previewMode ? 'hidden' : 'block'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-tight">
                {editingPost ? 'Edit Post' : 'Create Post'}
              </h2>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-xs font-mono text-white/50 hover:text-[#00FF00] flex items-center space-x-1"
                >
                  <Eye size={14} />
                  <span>{previewMode ? 'EDIT' : 'PREVIEW'}</span>
                </button>
                <button 
                  onClick={resetForm}
                  className="text-xs font-mono text-white/50 hover:text-red-400"
                >
                  CANCEL
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/50 uppercase tracking-widest">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingPost) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }
                  }}
                  required
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#00FF00] transition-colors font-mono"
                  placeholder="Post Title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/50 uppercase tracking-widest">Slug</label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#00FF00] transition-colors font-mono"
                  placeholder="post-slug-url"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/50 uppercase tracking-widest">Excerpt</label>
                <textarea 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#00FF00] transition-colors font-mono h-24 resize-none"
                  placeholder="Short summary..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/50 uppercase tracking-widest">Content (Markdown)</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#00FF00] transition-colors font-mono h-96 resize-y"
                  placeholder="# Write your post here..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/50 uppercase tracking-widest">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#00FF00] transition-colors font-mono"
                  placeholder="react, typescript, web"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/50 uppercase tracking-widest">Publication Date</label>
                <input 
                  type="date" 
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#00FF00] transition-colors font-mono custom-date-input"
                />
                <p className="text-xs text-white/30 font-mono">Leave blank to use current date when published.</p>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <input 
                  type="checkbox" 
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-5 h-5 bg-white/5 border border-white/10 text-[#00FF00] focus:ring-[#00FF00] focus:ring-offset-0"
                />
                <label htmlFor="isPublished" className="text-sm font-mono text-white/80 uppercase tracking-widest">
                  Publish Post
                </label>
              </div>

              <div className="flex flex-col space-y-4 mt-8">
                <button 
                  type="button"
                  onClick={handleRefineWithAI}
                  disabled={isRefining}
                  className="w-full flex justify-center items-center space-x-2 bg-white/10 text-white px-6 py-4 font-mono font-bold uppercase tracking-wider hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  {isRefining ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  <span>{isRefining ? 'Refining...' : 'Refine with AI'}</span>
                </button>

                <button 
                  type="submit"
                  className="w-full flex justify-center items-center space-x-2 bg-[#00FF00] text-black px-6 py-4 font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  <Save size={18} />
                  <span>Save Post</span>
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className={`space-y-6 ${!previewMode ? 'hidden' : 'block'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white/50">Preview</h2>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-xs font-mono text-white/50 hover:text-[#00FF00] flex items-center space-x-1"
                >
                  <Eye size={14} />
                  <span>EDIT</span>
                </button>
                <button 
                  onClick={resetForm}
                  className="text-xs font-mono text-white/50 hover:text-red-400"
                >
                  CANCEL
                </button>
              </div>
            </div>
            <div className="p-8 border border-white/10 bg-[#0a0a0a] min-h-[800px]">
              <h1 className="text-4xl font-black tracking-tighter mb-6">{title || 'Untitled'}</h1>
              <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#00FF00] prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10 prose-code:text-[#00FF00]">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          children={String(children).replace(/\n$/, '')}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                        />
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {content || '*Content preview will appear here...*'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-white/5 text-white/50 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-normal">Title</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Date</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs border ${post.isPublished ? 'border-[#00FF00] text-[#00FF00]' : 'border-yellow-500 text-yellow-500'}`}>
                      {post.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/50">
                    {post.isPublished && post.publishedAt ? new Date(post.publishedAt.toDate()).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-4">
                      <button 
                        onClick={() => handleEdit(post)}
                        className="text-white/50 hover:text-[#00FF00] transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="text-white/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-white/50">
                    No posts found. Create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
