package com.quickserve.service;

import com.quickserve.dto.ServiceDto;
import com.quickserve.model.ServiceEntity;
import com.quickserve.repository.ServiceRepository;
import com.quickserve.exception.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceServiceImpl(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Override
    public ServiceDto createService(ServiceDto dto) {
        ServiceEntity entity = mapToEntity(dto);
        ServiceEntity savedEntity = serviceRepository.save(entity);
        return mapToDto(savedEntity);
    }

    @Override
    public ServiceDto getServiceById(Long id) {
        ServiceEntity entity = serviceRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Service not found with id: " + id));
        return mapToDto(entity);
    }

    @Override
    public List<ServiceDto> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceDto> getServicesByProviderId(Long providerId) {
        return serviceRepository.findByProviderId(providerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceDto updateService(Long id, ServiceDto dto) {
        ServiceEntity entity = serviceRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Service not found with id: " + id));

        entity.setServiceName(dto.getServiceName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setDurationMinutes(dto.getDurationMinutes());
        entity.setImageUrl(dto.getImageUrl());
        // Do not update providerId or created_at

        ServiceEntity updatedEntity = serviceRepository.save(entity);
        return mapToDto(updatedEntity);
    }

    @Override
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new BadRequestException("Service not found with id: " + id);
        }
        serviceRepository.deleteById(id);
    }

    private ServiceEntity mapToEntity(ServiceDto dto) {
        return ServiceEntity.builder()
                .providerId(dto.getProviderId())
                .serviceName(dto.getServiceName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .durationMinutes(dto.getDurationMinutes())
                .imageUrl(dto.getImageUrl())
                .build();
    }

    private ServiceDto mapToDto(ServiceEntity entity) {
        return ServiceDto.builder()
                .id(entity.getId())
                .providerId(entity.getProviderId())
                .serviceName(entity.getServiceName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .durationMinutes(entity.getDurationMinutes())
                .imageUrl(entity.getImageUrl())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
