package com.framecheckmate.userservice.project.controller;

import com.framecheckmate.userservice.member.entity.Member;
import com.framecheckmate.userservice.member.repository.MemberRepository;
import com.framecheckmate.userservice.project.dto.MemberInviteDTO;
import com.framecheckmate.userservice.project.dto.ProjectCreateDTO;
import com.framecheckmate.userservice.project.dto.ProjectDTO;
import com.framecheckmate.userservice.project.dto.ProjectInviteDTO;
import com.framecheckmate.userservice.project.entity.Project;
import com.framecheckmate.userservice.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/project")
@Slf4j
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final MemberRepository memberRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Project> createProject(
            @RequestPart("projectName") String name,
            Authentication authentication
    ) {
        log.info("Received project creation request with name: {}", name);

        ProjectCreateDTO dto = new ProjectCreateDTO();
        dto.setName(name);
        String userEmail = authentication.getName();
        log.info("userEmail: {}", userEmail);
        Project createdProject = projectService.createProject(dto, userEmail);
        projectService.addProjectMember(name, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @GetMapping("/my-project")
    public ResponseEntity<List<ProjectDTO>> getMemberProjects(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Project> projects = projectService.findMemberProjects(userEmail);
        List<ProjectDTO> projectDTOs = projects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(projectDTOs);
    }

    private ProjectDTO convertToDTO(Project project) {
        return ProjectDTO.builder()
                .projectId(project.getProjectId())
                .name(project.getName())
                .isFinished(project.getIsFinished())
                .managerId(project.getManagerId())
                .build();
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<?> getProjectMembers(@PathVariable(value="projectId") UUID projectId, Authentication authentication) {
        String userEmail = authentication.getName(); // gets current user's email
        List<Member> members = projectService.getProjectMembers(projectId, userEmail);

        return ResponseEntity.ok(members);
    }

    @PostMapping("/invite")
    public ResponseEntity<Void> inviteProject(@RequestBody ProjectInviteDTO projectInviteDTO) {
        log.info(projectInviteDTO.getProjectId().toString());
        UUID projectId = projectInviteDTO.getProjectId();
        List<MemberInviteDTO> members = projectInviteDTO.getMembers();

        for (MemberInviteDTO member : members) {

            log.info("Processing invite for email: {}", member.getEmail());
            projectService.inviteProjectMember(projectId, member.getEmail());
        }

        return ResponseEntity.ok().build();
    }

}