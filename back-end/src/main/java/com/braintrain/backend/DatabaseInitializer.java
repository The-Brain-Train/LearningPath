package com.braintrain.backend;

import com.braintrain.backend.roadMaps.RoadMapMeta;
import com.braintrain.backend.roadMaps.RoadMapRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Map;

@Configuration
public class DatabaseInitializer {

    private final MongoTemplate mongoTemplate;
    private final RoadMapRepository roadmapRepository;

    public DatabaseInitializer(MongoTemplate mongoTemplate, RoadMapRepository roadmapRepository) {
        this.mongoTemplate = mongoTemplate;
        this.roadmapRepository = roadmapRepository;
    }

    @Bean
    CommandLineRunner initDatabase(RoadMapRepository repository) {
        mongoTemplate.dropCollection(RoadMapMeta.class);
        return args -> {
            repository.save(new RoadMapMeta("JavaScript"));
            repository.save(new RoadMapMeta("Java"));
            repository.save(new RoadMapMeta("Python"));
            repository.save(new RoadMapMeta("C++"));
        };
    }
}