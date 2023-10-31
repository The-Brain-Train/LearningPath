package com.braintrain.backend.service;

import com.braintrain.backend.controller.dtos.FileDTO;
import com.braintrain.backend.exceptionHandler.exception.GCPFileUploadException;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.UUID;

@Component
public class FileService {
    @Value("${gcp.config.file}")
    private String gcpConfigFile;
    @Value("${gcp.project.id}")
    private String gcpProjectId;
    @Value("${gcp.bucket.id}")
    private String gcpBucketId;
    @Value("${gcp.dir.name}")
    private String gcpDirectoryName;

    public FileDTO uploadFile(MultipartFile multipartFile, String fileName, String contentType) {
        try {
            byte[] fileData = multipartFile.getBytes();
            byte[] jsonBytes = gcpConfigFile.getBytes();

            ByteArrayInputStream inputStream = new ByteArrayInputStream(jsonBytes);
            GoogleCredentials credentials = GoogleCredentials.fromStream(inputStream);
            StorageOptions options = StorageOptions.newBuilder()
                    .setProjectId(gcpProjectId)
                    .setCredentials(credentials)
                    .build();

            Storage storage = options.getService();
            Bucket bucket = storage.get(gcpBucketId, Storage.BucketGetOption.fields());

            UUID uuid = UUID.randomUUID();
            String id = uuid.toString();

            Blob blob = bucket.create(gcpDirectoryName + "/" + fileName + "-" + id, fileData, contentType);

            if (blob != null) {
                return new FileDTO(blob.getName(), blob.getMediaLink());
            }
        } catch (Exception e) {
            throw new GCPFileUploadException("An error occurred while storing data to GCS");
        }
        throw new GCPFileUploadException("An error occurred while storing data to GCS");
    }

    public void deleteFile(String existingFileName) {
        try {
            byte[] jsonBytes = gcpConfigFile.getBytes();
            ByteArrayInputStream inputStream = new ByteArrayInputStream(jsonBytes);

            int index1 = existingFileName.indexOf("%2F");
            int index2 = existingFileName.indexOf("generation=");
            String encodedFileName  = existingFileName.substring(index1 + 3, index2 - 1);

            GoogleCredentials credentials = GoogleCredentials.fromStream(inputStream);
            StorageOptions options = StorageOptions.newBuilder()
                    .setProjectId(gcpProjectId)
                    .setCredentials(credentials)
                    .build();

            Storage storage = options.getService();
            String filePathName = gcpDirectoryName + "/" + encodedFileName;
            storage.delete(gcpBucketId, filePathName);
        } catch (Exception e) {
            e.printStackTrace();
            throw new GCPFileUploadException("An error occurred while deleting the file from GCS");
        }
    }
}
