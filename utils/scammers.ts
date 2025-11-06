import { supabase } from '../lib/supabase';
import { Scammer } from '../types';

export interface ScammerFormData {
  roblox_username: string;
  telegram_nickname?: string;
  telegram_username?: string;
  reason: string;
  description?: string;
  damage_amount?: number;
  status?: 'pending' | 'verified';
}

/**
 * Upload scammer proof images to Supabase Storage
 * @param files Array of image files to upload
 * @returns Array of public URLs for the uploaded images
 */
export async function uploadScammerProofs(files: File[]): Promise<string[]> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('scammer-proofs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('scammer-proofs')
      .getPublicUrl(data.path);

    uploadedUrls.push(publicUrl);
  }

  return uploadedUrls;
}

/**
 * Add a new scammer entry to the database
 * @param formData Scammer information
 * @param proofImages Array of proof image URLs
 * @param addedBy User ID of the admin adding the entry (can be null or 0)
 */
export async function addScammer(
  formData: ScammerFormData,
  proofImages: string[],
  addedBy: number
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { error } = await supabase
    .from('scammers')
    .insert({
      roblox_username: formData.roblox_username,
      telegram_nickname: formData.telegram_nickname || null,
      telegram_username: formData.telegram_username || null,
      reason: formData.reason,
      description: formData.description || null,
      damage_amount: formData.damage_amount || null,
      proof_images: proofImages,
      status: formData.status || 'pending',
      added_by: addedBy > 0 ? addedBy : null
    });

  if (error) {
    console.error('Error adding scammer:', error);
    throw new Error(`Failed to add scammer: ${error.message}`);
  }
}

/**
 * Search scammers by Roblox username or Telegram username
 * @param query Search query
 * @returns Array of matching scammers
 */
export async function searchScammers(query: string): Promise<Scammer[]> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const searchQuery = query.toLowerCase().trim();

  const { data, error } = await supabase
    .from('scammers')
    .select('*')
    .or(`roblox_username.ilike.%${searchQuery}%,telegram_username.ilike.%${searchQuery}%,telegram_nickname.ilike.%${searchQuery}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching scammers:', error);
    throw new Error(`Failed to search scammers: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all scammers with optional filters
 * @param filters Optional filters for status and sort order
 * @returns Array of scammers
 */
export async function getScammers(filters?: {
  status?: 'pending' | 'verified' | 'all';
  sortBy?: 'newest' | 'oldest';
}): Promise<Scammer[]> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  let query = supabase.from('scammers').select('*');

  // Apply status filter
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  // Apply sorting
  const ascending = filters?.sortBy === 'oldest';
  query = query.order('created_at', { ascending });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching scammers:', error);
    throw new Error(`Failed to fetch scammers: ${error.message}`);
  }

  return data || [];
}

/**
 * Delete a scammer entry (admin only)
 * @param id Scammer ID to delete
 */
export async function deleteScammer(id: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  // First, get the scammer to delete their proof images
  const { data: scammer, error: fetchError } = await supabase
    .from('scammers')
    .select('proof_images')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching scammer for deletion:', fetchError);
    throw new Error(`Failed to fetch scammer: ${fetchError.message}`);
  }

  // Delete proof images from storage
  if (scammer?.proof_images && scammer.proof_images.length > 0) {
    const filePaths = scammer.proof_images.map(url => {
      // Extract file path from URL
      const urlParts = url.split('/scammer-proofs/');
      return urlParts[1] || '';
    }).filter(path => path !== '');

    if (filePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('scammer-proofs')
        .remove(filePaths);

      if (storageError) {
        console.error('Error deleting proof images:', storageError);
        // Continue with deletion even if storage cleanup fails
      }
    }
  }

  // Delete the scammer entry
  const { error } = await supabase
    .from('scammers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting scammer:', error);
    throw new Error(`Failed to delete scammer: ${error.message}`);
  }
}

/**
 * Update a scammer entry (admin only)
 * @param id Scammer ID to update
 * @param updates Fields to update
 */
export async function updateScammer(
  id: string,
  updates: Partial<ScammerFormData>
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { error } = await supabase
    .from('scammers')
    .update({
      roblox_username: updates.roblox_username,
      telegram_nickname: updates.telegram_nickname || null,
      telegram_username: updates.telegram_username || null,
      reason: updates.reason,
      description: updates.description || null,
      damage_amount: updates.damage_amount || null,
      status: updates.status
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating scammer:', error);
    throw new Error(`Failed to update scammer: ${error.message}`);
  }
}

/**
 * Get a single scammer by ID
 * @param id Scammer ID
 * @returns Scammer object
 */
export async function getScammerById(id: string): Promise<Scammer | null> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase
    .from('scammers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching scammer:', error);
    return null;
  }

  return data;
}

