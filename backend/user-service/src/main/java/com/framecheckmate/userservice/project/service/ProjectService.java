package com.framecheckmate.userservice.project.service;

import com.framecheckmate.userservice.member.entity.Member;
import com.framecheckmate.userservice.member.kafka.KafkaDtoMapper;
import com.framecheckmate.userservice.member.kafka.MemberKafkaProducer;
import com.framecheckmate.userservice.member.kafka.dto.NotificationSaveRequest;
import com.framecheckmate.userservice.member.kafka.dto.NotificationType;
import com.framecheckmate.userservice.member.repository.MemberRepository;
import com.framecheckmate.userservice.project.dto.ProjectCreateDTO;
import com.framecheckmate.userservice.project.entity.Project;
import com.framecheckmate.userservice.project.entity.ProjectMember;
import com.framecheckmate.userservice.project.repository.ProjectMemberRepository;
import com.framecheckmate.userservice.project.repository.ProjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final MemberKafkaProducer memberKafkaProducer;
    private final KafkaDtoMapper kafkaDtoMapper;

    private static final String NOTIFICATION_TOPIC = "member-notification-topic";

    public ProjectService(ProjectRepository projectRepository, MemberRepository memberRepository, ProjectMemberRepository projectMemberRepository,
                          MemberKafkaProducer memberKafkaProducer, KafkaDtoMapper kafkaDtoMapper) {
        this.projectRepository = projectRepository;
        this.memberRepository = memberRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.memberKafkaProducer = memberKafkaProducer;
        this.kafkaDtoMapper = kafkaDtoMapper;
    }

    @Transactional
    public Project createProject(ProjectCreateDTO dto, String userEmail) {
        log.info("Attempting to create project for user email: {}", userEmail);

        Member member = memberRepository.findByEmail(userEmail);

        //creating project.
        Project project = new Project();
        project.setProjectId(UUID.randomUUID());
        project.setName(dto.getName());
        //created project and set the user created project as manager.
        project.setManagerId(member.getMemberId());
        project.setIsFinished(false);

        Project saveProject = projectRepository.save(project);

        memberKafkaProducer.sendMessage(NOTIFICATION_TOPIC,
                kafkaDtoMapper.makeNotificationSaveRequest(
                    new NotificationSaveRequest(
                            userEmail,
                            NotificationType.PROJECT_CREATE
                    )
                ));

        return saveProject;
    }

    public void addProjectMember(String projectName, String userEmail) {
        Member member = memberRepository.findByEmail(userEmail);
        Project project = projectRepository.findByName(projectName);

        ProjectMember projectMember = new ProjectMember();
        projectMember.setId(UUID.randomUUID());
        projectMember.setProject(project);
        projectMember.setMember(member);

        log.info("Creating project member with Project: {}, Member: {}",
                project.getName(), member.getEmail());

        projectMemberRepository.save(projectMember);
    }

    @Transactional
    public void inviteProjectMember(UUID projectId, String userEmail) {
        Member member = memberRepository.findByEmail(userEmail);
        Project project = projectRepository.findByProjectId(projectId);

        // for(Member member : members){
        ProjectMember projectMember = new ProjectMember();
        projectMember.setId(UUID.randomUUID());
        projectMember.setProject(project);
        projectMember.setMember(member);
        projectMemberRepository.save(projectMember);

        // }

        memberKafkaProducer.sendMessage(NOTIFICATION_TOPIC,
                kafkaDtoMapper.makeNotificationSaveRequest(
                        new NotificationSaveRequest(
                                member.getEmail(),
                                NotificationType.PROJECT_INVITE
                        )
                ));
    }

    public List<Project> findMemberProjects(String userEmail) {
        List<ProjectMember> projectMembers = projectMemberRepository.findByMemberEmail(userEmail);
        return projectMembers.stream()
                .map(ProjectMember::getProject)
                .collect(Collectors.toList());
    }

    public List<Member> getProjectMembers(UUID projectId, String userEmail) {
        log.info("Fetching members for project ID: {} by user: {}", projectId, userEmail);

        // Verify current user is a member of this project
        Member currentMember = memberRepository.findByEmail(userEmail);

        return projectMemberRepository.findMembersByProjectId(projectId);
    }
}