export type CloudinaryImage = {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: Date;
    tags: Array<any>;
    bytes: number;
    type: string;
    etag: string;
    placeholder: false;
    url: string;
    secure_url: string;
    original_filename: string;
};

export type UploadType = {
    fileName: string;
    fileType: string;
    url: string;
    size: number;
};
