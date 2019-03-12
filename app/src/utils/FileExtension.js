// allowed to create/view file formats  
export const FILE_EXTENSIONS = {
    ".hs":          true,
    ".md":          true,
    ".markdown":    true,
    ".mkd":         true,
    ".mdown":       true,
    ".mkdn":        true,
    ".mdwn":        true,
    ".mdtext":      true,
    ".text":        true,
    ".Rmd":         true,
    ".txt":         true
};

// utility class for validating file names
export class FileExtension{
    // makes sure a file name has a valid extension (such as .hs)
    // puts '.hs' at end of file if it does not
    // @param fname     raw file name
    static validateFileName(fname){
        for(let ext in FILE_EXTENSIONS){
            if(fname.endsWith(ext)){
                return fname;
            }
        }
        return `${fname}.hs`; // due to dropdown this should never happen 
    }

    // lists all file extension values
    static list(){
        return Object.keys(FILE_EXTENSIONS);
    }
}