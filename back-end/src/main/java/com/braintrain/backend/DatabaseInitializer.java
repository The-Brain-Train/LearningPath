package com.braintrain.backend;

import com.braintrain.backend.roadMaps.RoadMapMeta;
import com.braintrain.backend.roadMaps.RoadMapMetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class DatabaseInitializer {

    private final MongoTemplate mongoTemplate;
    private final RoadMapMetaRepository roadmapMetaRepository;

    @Autowired
    public DatabaseInitializer(MongoTemplate mongoTemplate, RoadMapMetaRepository roadmapMetaRepository) {
        this.mongoTemplate = mongoTemplate;
        this.roadmapMetaRepository = roadmapMetaRepository;
    }

    @Bean
    CommandLineRunner initDatabase(RoadMapMetaRepository repository) {
        mongoTemplate.dropCollection(RoadMapMeta.class);
        return args -> {
            repository.save(new RoadMapMeta("JavaScript"));
            repository.save(new RoadMapMeta("Java"));
            repository.save(new RoadMapMeta("Python"));
            repository.save(new RoadMapMeta("C++"));
        };
    }
}