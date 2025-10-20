// sections/MediaSection.jsx
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { MdImage as ImageIcon, MdExpandMore as ExpandMoreIcon } from 'react-icons/md';
import { useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import DropzoneField from "../../components/Dropzone.components"
export const MediaSection = ({ formData, setFormData, errors = {}, setErrors }) => {

    const MAX_IMAGE_SIZE_MB = 5;
    const MAX_VIDEO_SIZE_MB = 50; // Videos are typically larger
    const ACCEPTED_VIDEO_FORMATS = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

    // Handle photo drop with compression
    const onDrop = useCallback(async (acceptedFiles) => {
        const compressedFiles = await Promise.all(
            acceptedFiles.map(async (file) => {
                try {
                    // Define compression options
                    const options = {
                        maxSizeMB: 1, // Max file size 1MB
                        maxWidthOrHeight: 1920, // Resize if needed
                        useWebWorker: true,
                    };

                    // Compress the image
                    const compressedBlob = await imageCompression(file, options);

                    // Create a new File object with the compressed data
                    const compressedFile = new File(
                        [compressedBlob],
                        file.name,
                        { type: file.type, lastModified: file.lastModified }
                    );

                    return {
                        file: compressedFile,
                        preview: URL.createObjectURL(compressedFile),
                        valid: compressedFile.size / 1024 / 1024 <= MAX_IMAGE_SIZE_MB,
                    };
                } catch (error) {
                    console.error("Image compression error:", error);
                    return {
                        file,
                        preview: URL.createObjectURL(file),
                        valid: false,
                    };
                }
            })
        );

        // Update state with compressed images
        setFormData((prevValues) => ({
            ...prevValues,
            photos: [...prevValues.photos, ...compressedFiles],
        }));

        // Set an error if any files exceed the max size
        const oversizedFiles = compressedFiles.filter((file) => !file.valid).map((file) => file.file.name);
        if (oversizedFiles?.length > 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                photos: `${MAX_IMAGE_SIZE_MB} MB limit: ${oversizedFiles.join(", ")}`,
            }));
        } else {
            // Clear photo errors if all files are valid
            setErrors((prevErrors) => ({
                ...prevErrors,
                photos: '',
            }));
        }
    }, [setFormData, setErrors]);

    // Handle video drop with validation
    const handleVideoDrop = useCallback((acceptedFiles) => {
        const validatedVideos = [];
        const invalidVideos = [];

        acceptedFiles.forEach((file) => {
            const fileSizeMB = file.size / 1024 / 1024;
            const isValidFormat = ACCEPTED_VIDEO_FORMATS.includes(file.type);
            const isValidSize = fileSizeMB <= MAX_VIDEO_SIZE_MB;

            if (!isValidFormat) {
                invalidVideos.push(`${file.name} (format non supporté)`);
            } else if (!isValidSize) {
                invalidVideos.push(`${file.name} (dépasse ${MAX_VIDEO_SIZE_MB}MB)`);
            } else {
                validatedVideos.push({
                    file,
                    preview: URL.createObjectURL(file),
                    valid: true,
                });
            }
        });

        // Update state with valid videos
        if (validatedVideos.length > 0) {
            setFormData((prev) => ({
                ...prev,
                videos: [...prev.videos, ...validatedVideos],
            }));
        }

        // Set error if there are invalid videos
        if (invalidVideos.length > 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                videos: `Fichiers invalides: ${invalidVideos.join(", ")}`,
            }));
        } else if (validatedVideos.length > 0) {
            // Clear error if all videos are valid
            setErrors((prevErrors) => ({
                ...prevErrors,
                videos: '',
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setFormData, setErrors]);

    // Wrapper function for setValues to match DropzoneField API
    const handleSetValues = (values) => {
        setFormData((prev) => ({
            ...prev,
            ...values,
        }));
    };

    // Wrapper function for setErrors to handle cases where it's not provided
    const handleSetErrors = (errorUpdate) => {
        if (setErrors) {
            if (typeof errorUpdate === 'function') {
                setErrors(errorUpdate);
            } else {
                setErrors((prev) => ({
                    ...prev,
                    ...errorUpdate,
                }));
            }
        }
    };

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ImageIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Photos et vidéos</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={3}>
                    <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                            Photos de l'entreprise
                        </Typography>
                        <DropzoneField 
                            onDrop={onDrop}
                            imagesfiles={formData.photos || []}
                            setValues={handleSetValues}
                            setErrors={handleSetErrors}
                            errors={errors}
                            fileType="image"
                            fieldName="photos"
                        />
                    </Grid>

                    <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                            Vidéos de l'entreprise
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            Formats acceptés: MP4, WebM, MOV • Taille max: {MAX_VIDEO_SIZE_MB}MB
                        </Typography>
                        <DropzoneField
                            onDrop={handleVideoDrop}
                            imagesfiles={formData.videos || []}
                            setValues={handleSetValues}
                            setErrors={handleSetErrors}
                            errors={errors}
                            fileType="video"
                            fieldName="videos"
                        />
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default MediaSection;