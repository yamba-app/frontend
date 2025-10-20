import { useDropzone } from "react-dropzone";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { FaTrash, FaVideo } from "react-icons/fa";
import { MdImage } from "react-icons/md";

const DropzoneField = ({ 
  onDrop, 
  imagesfiles = [], 
  setValues, 
  setErrors, 
  errors,
  fileType = 'image', // 'image' or 'video'
  fieldName = 'images', // field name for errors and state
  acceptedFormats // optional: custom accepted formats
}) => {
  
  // Define accepted file types based on fileType prop
  const getAcceptedFiles = () => {
    if (acceptedFormats) {
      return acceptedFormats.reduce((acc, format) => {
        acc[format] = [];
        return acc;
      }, {});
    }
    
    if (fileType === 'video') {
      return {
        'video/mp4': ['.mp4'],
        'video/webm': ['.webm'],
        'video/ogg': ['.ogg'],
        'video/quicktime': ['.mov'],
      };
    }
    
    // Default to images
    return {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptedFiles(),
    multiple: true,
  });

  const removeFile = (index) => {
    const newFiles = imagesfiles.filter((_, i) => i !== index);
    
    // Revoke the object URL to prevent memory leaks
    if (imagesfiles[index]?.preview) {
      URL.revokeObjectURL(imagesfiles[index].preview);
    }
    
    setValues({ [fieldName]: newFiles });
    
    if (setErrors) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: newFiles?.length ? "" : `Veuillez télécharger au moins un${fileType === 'video' ? 'e vidéo' : 'e image'}.`,
      }));
    }
  };

  const getDropzoneText = () => {
    if (isDragActive) {
      return `Déposez ${fileType === 'video' ? 'la vidéo' : "l'image"} ici ...`;
    }
    return `Glissez et déposez ${fileType === 'video' ? 'des vidéos' : 'des images'} ici, ou cliquez pour sélectionner des fichiers`;
  };

  const renderPreview = (file, index) => {
    if (fileType === 'video') {
      return (
        <Box
          sx={{
            position: "relative",
            width: 100,
            height: 100,
            borderRadius: 1,
            overflow: "hidden",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Video thumbnail with play icon overlay */}
          <video
            src={file.preview}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaVideo size={20} />
          </Box>
          <IconButton
            color="error"
            size="small"
            sx={{ 
              position: "absolute", 
              top: 4, 
              right: 4,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              removeFile(index);
            }}
            aria-label="Remove video"
          >
            <FaTrash size={12} />
          </IconButton>
        </Box>
      );
    }

    // Image preview
    return (
      <Box
        sx={{
          position: "relative",
          width: 100,
          height: 100,
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <img
          src={file.preview}
          alt={`Preview ${index}`}
          boxSize="100px"
          height="100px"
          objectFit="cover"
        />
        <IconButton
          color="error"
          size="small"
          sx={{ 
            position: "absolute", 
            top: 4, 
            right: 4,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            removeFile(index);
          }}
          aria-label="Remove image"
        >
          <FaTrash size={12} />
        </IconButton>
      </Box>
    );
  };

  return (
    <>
      {/* Dropzone Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed gray",
          p: 2,
          textAlign: "center",
          borderRadius: 1,
          cursor: "pointer",
          minHeight: imagesfiles.length === 0 ? "120px" : "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": { borderColor: "primary.main" },
          transition: "border-color 0.3s",
        }}
      >
        <input {...getInputProps()} />
        {imagesfiles.length === 0 && (
          <Box sx={{ textAlign: "center" }}>
            {fileType === 'video' ? (
              <FaVideo size={40} style={{ marginBottom: 8, opacity: 0.5 }} />
            ) : (
              <MdImage size={40} style={{ marginBottom: 8, opacity: 0.5 }} />
            )}
            <Typography color="text.secondary">
              {getDropzoneText()}
            </Typography>
          </Box>
        )}
        {imagesfiles.length > 0 && (
          <Box
            display="flex"
            gap={2}
            overflow="auto"
            sx={{ 
              "&::-webkit-scrollbar": { display: "none" },
              width: "100%",
              py: 1,
            }}
          >
            {imagesfiles.map((file, index) => (
              <Box 
                key={index} 
                position="relative" 
                sx={{ 
                  display: "inline-block",
                  flexShrink: 0,
                }}
              >
                {renderPreview(file, index)}
                
                {/* File name caption */}
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100px",
                    color: "text.secondary",
                  }}
                  title={file.file?.name}
                >
                  {file.file?.name}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Error Messages */}
      {errors?.[fieldName] && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {errors[fieldName]}
        </Typography>
      )}
    </>
  );
};

DropzoneField.propTypes = {
  onDrop: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  setErrors: PropTypes.func,
  imagesfiles: PropTypes.array,
  errors: PropTypes.object,
  fileType: PropTypes.oneOf(['image', 'video']),
  fieldName: PropTypes.string,
  acceptedFormats: PropTypes.array,
};

export default DropzoneField;