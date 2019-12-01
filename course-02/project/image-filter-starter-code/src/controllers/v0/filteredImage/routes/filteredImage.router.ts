import { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles, validURL} from '../../../../util/util';

const router: Router = Router();

// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
router.get('/',
    async (req: Request, res: Response) => {

        let image_url = req.query.image_url;
        if (!validURL(image_url)) {
          return res.status(422).send({ message: 'The \'image_url\' is a required query parameter' });
        }
    
        const filteredImagePath: string = await filterImageFromURL(image_url);
    
        res.sendFile(filteredImagePath, function(err) {
          if (!err) {
            let files = new Array<string>();
            files.push(filteredImagePath);
            deleteLocalFiles(files);
          }
        });
    }
);

export const FilteredImageRouter: Router = router;