'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, GripVertical, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  bucket?: string;
  folder?: string;
  maxPhotos?: number;
}

export default function PhotoUploader({
  photos,
  onChange,
  bucket = 'property-photos',
  folder = 'properties',
  maxPhotos = 20,
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (photos.length + list.length > maxPhotos) {
      toast.error(`Máximo de ${maxPhotos} fotos. Você tem ${photos.length}.`);
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of list) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name}: não é uma imagem`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: maior que 5MB`);
        continue;
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: upErr } = await supabase.storage.from(bucket).upload(name, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (upErr) {
        toast.error(`Falha ao enviar ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(name);
      uploaded.push(urlData.publicUrl);
    }

    if (uploaded.length > 0) {
      onChange([...photos, ...uploaded]);
      toast.success(`${uploaded.length} foto(s) enviada(s)`);
    }

    setUploading(false);
  }

  async function removePhoto(idx: number) {
    const url = photos[idx];
    const next = photos.filter((_, i) => i !== idx);
    onChange(next);

    // Tenta deletar do storage (extraindo o path da URL pública)
    try {
      const supabase = createClient();
      const path = url.split(`/${bucket}/`)[1];
      if (path) await supabase.storage.from(bucket).remove([path]);
    } catch {
      // Não-crítico
    }
  }

  function onDragStart(idx: number) {
    setDraggedIdx(idx);
  }

  function onDragOverItem(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const next = [...photos];
    const [moved] = next.splice(draggedIdx, 1);
    next.splice(idx, 0, moved);
    setDraggedIdx(idx);
    onChange(next);
  }

  function onDragEnd() {
    setDraggedIdx(null);
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
          ${dragOver ? 'border-terra bg-terra/5' : 'border-border hover:border-terra/40 hover:bg-cream/30'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files?.length && uploadFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <Loader2 size={32} className="text-terra animate-spin" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-cream border border-border flex items-center justify-center">
              <Upload size={22} className="text-terra" strokeWidth={1.7} />
            </div>
          )}
          <p className="text-sm font-medium text-ink mt-2">
            {uploading ? 'Enviando fotos...' : 'Arraste fotos aqui ou clique para selecionar'}
          </p>
          <p className="text-xs text-ink-soft/60">
            PNG, JPG ou WEBP até 5MB · Máx {maxPhotos} fotos
            {photos.length > 0 && <> · <strong>{photos.length}/{maxPhotos}</strong></>}
          </p>
        </div>
      </div>

      {/* Preview grid */}
      {photos.length > 0 && (
        <>
          <p className="text-xs text-ink-soft/70 flex items-center gap-1.5">
            <AlertCircle size={12} /> Arraste para reordenar. A primeira foto será a principal.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((url, idx) => (
              <div
                key={url}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOverItem(e, idx)}
                onDragEnd={onDragEnd}
                className={`
                  group relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-move
                  ${idx === 0 ? 'border-terra ring-2 ring-terra/20' : 'border-border'}
                  ${draggedIdx === idx ? 'opacity-50' : ''}
                `}
              >
                <Image src={url} alt={`Foto ${idx + 1}`} fill className="object-cover" sizes="200px" />
                <div className="absolute top-1.5 left-1.5">
                  <span className="bg-black/60 text-white text-xs px-1.5 py-0.5 rounded font-mono backdrop-blur-sm">
                    {idx + 1}
                  </span>
                </div>
                {idx === 0 && (
                  <div className="absolute bottom-1.5 left-1.5">
                    <span className="bg-terra text-white text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded font-semibold">
                      Principal
                    </span>
                  </div>
                )}
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
                    className="bg-red text-white p-1 rounded-md hover:bg-red/90"
                    title="Remover foto"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent h-10 flex items-end justify-center pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={14} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
