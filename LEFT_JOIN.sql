SELECT gallery.*, gallery_file.id AS file_id, gallery_file.savefile FROM gallery 
LEFT JOIN gallery_file ON gallery.id = gallery_file.fid
WHERE gallery.id = 45;
-- SELECT * FROM gallery WHERE id=45;
-- SELECT * FROM gallery_file WHERE fid=45; 