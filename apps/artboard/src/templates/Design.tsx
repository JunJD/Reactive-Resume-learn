import {
  Award,
  Certification,
  CustomSection,
  CustomSectionGroup,
  Education,
  Experience,
  Interest,
  Language,
  Profile,
  Project,
  Publication,
  Reference,
  SectionKey,
  SectionWithItem,
  Skill,
  URL,
  Volunteer,
} from "@reactive-resume/schema";
import {
  MapPin
} from "@phosphor-icons/react";
import { cn, hexToRgb, isEmptyString, isUrl, linearTransform } from "@reactive-resume/utils";
import get from "lodash.get";
import { Fragment } from "react";

import { Picture } from "../components/picture";
import { useArtboardStore } from "../store/artboard";
import { TemplateProps } from "../types/template";
import * as Avatar from '@radix-ui/react-avatar';
import { MattsIcon } from "../components/mattsIcon";

const Header = () => {
  const basics = useArtboardStore((state) => state.resume.basics);
  const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);
  return (
    <div className="flex flex-col items-start space-y-4 text-left">
      <Avatar.Root className="bg-blackA1 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
        <Avatar.Image
          className="h-full w-full rounded-[inherit] object-cover"
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <Avatar.Fallback
          className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
          delayMs={600}
        >
          CT
        </Avatar.Fallback>
      </Avatar.Root>

      <div className="space-y-4">
        <div>
          <div className="text-2xl font-bold">{basics.name}</div>
          <div className="text-base mt-2">{basics.headline}</div>
        </div>

        <div className="flex flex-row item-center w-[142px] pt-6">
          <MattsIcon
            color={primaryColor}
            colNum={6}
            rowNum={6}
            offset='3px 2px'
            renderText={() => {
              return (
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="5.8299560546875" height="4.58001708984375" viewBox="0 0 5.8299560546875 4.58001708984375" fill="none">
                  <path d="M1.30644 4.58C1.99234 4.58 2.49856 4.07487 2.49856 3.46866C2.49856 2.79513 2.05764 2.34052 1.40445 2.34052C1.24115 2.34052 1.1105 2.40789 1.07779 2.4247C1.1105 1.70065 1.84537 1.04397 2.49856 0.926122L2.49856 0C1.5351 0.101035 0 0.94293 0 3.04772C0 3.97384 0.555249 4.58 1.30644 4.58ZM5.83 0C4.86648 0.101035 3.33144 0.94293 3.33144 3.04772C3.33144 3.97384 3.88669 4.58 4.63788 4.58C5.32378 4.58 5.83 4.07487 5.83 3.46866C5.83 2.79513 5.38908 2.34052 4.73583 2.34052C4.57253 2.34052 4.44188 2.40789 4.40923 2.4247C4.44188 1.70065 5.17681 1.04397 5.83 0.926122L5.83 0Z" fill-rule="evenodd" fill="#79819A" >
                  </path>
                </svg>
              )
            }}
          />

          <div className="leading-none px-2 text-sm">
            <span className="text-justify">People ignore design that ignore people.</span>

            <p className="text-xs color-violet11 leading-1 mt-2">Frank Kimero</p>
          </div>

          <MattsIcon
            color={primaryColor}
            colNum={5}
            rowNum={10}
            offset='13px 2px'
            renderText={() => {
              return (
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="5.8299560546875" height="4.58001708984375" viewBox="0 0 5.8299560546875 4.58001708984375" fill="none">
                  <path d="M4.75221 2.1553C4.7195 2.87935 3.98463 3.53603 3.33144 3.65388L3.33144 4.58C4.2949 4.47897 5.83 3.63707 5.83 1.53228C5.83 0.606163 5.27475 0 4.52356 0C3.83766 0 3.33144 0.505128 3.33144 1.11134C3.33144 1.78487 3.77236 2.23948 4.42555 2.23948C4.58885 2.23948 4.7195 2.17211 4.75221 2.1553ZM0 3.65388L0 4.58C0.963524 4.47897 2.49856 3.63707 2.49856 1.53228C2.49856 0.606163 1.94331 0 1.19212 0C0.506219 0 0 0.505128 0 1.11134C0 1.78487 0.440923 2.23948 1.09417 2.23948C1.25747 2.23948 1.38812 2.17211 1.42077 2.1553C1.38812 2.87935 0.653193 3.53603 0 3.65388Z" fill-rule="evenodd" fill="#79819A" >
                  </path>
                </svg>

              )
            }}
          />

        </div>


        <div className="flex flex-col items-start py-4 text-left text-sm gap-y-4">
          {basics.email && (
            <div className="flex items-center gap-x-4">
              <div className="rounded-full p-custom bg-[#E2E6EE] w-3 h-3 flex items-center justify-center">
                <i className="ph ph-bold ph-at text-primary" />
              </div>
              <div className="flex flex-col">
                Email
                <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
                  {basics.email}
                </a>
              </div>
            </div>
          )}
          {basics.location && (
            <div className="flex items-center gap-x-4">
              <div className="rounded-full p-custom bg-[#E2E6EE] w-3 h-3 flex items-center justify-center">
                <i className="ph ph-bold ph-map-pin text-primary" />
              </div>
              <div className="flex flex-col">
                Location
                <div>{basics.location}</div>
              </div>
            </div>
          )}
          {basics.phone && (
            <div className="flex items-center gap-x-4">
              <div className="rounded-full p-custom bg-[#E2E6EE] w-3 h-3 flex items-center justify-center">
                <i className="ph ph-bold ph-phone text-primary" />
              </div>
              <div className="flex flex-col">
                Phone
                <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
                  {basics.phone}
                </a>
              </div>
            </div>
          )}
          {/* <Link url={basics.url} /> */}

          {
            basics.url && (
              <div className="flex items-center gap-x-4">
                <div className="rounded-full p-custom bg-[#E2E6EE] w-3 h-3 flex items-center justify-center">
                  <i className="ph ph-bold ph-link text-primary group-[.sidebar]:text-primary" />
                </div>
                <div className="flex flex-col">
                  Url
                  <a
                    href={basics.url.href}
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                    className={cn("inline-block")}
                  >
                    {basics.url.label || basics.url.href}
                  </a>
                </div>
              </div>
            )
          }

          {basics.customFields.map((item) => (
            <div key={item.id} className="flex items-center gap-x-4">
              <div className="rounded-full p-custom bg-[#E2E6EE] w-3 h-3 flex items-center justify-center">
                <i className={cn(`ph ph-bold ph-${item.icon} text-primary`)} />
              </div>
              <div className="flex flex-col">
                {item.name}
                <span>{[item.name, item.value].filter(Boolean).join(": ")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Summary = () => {
  const section = useArtboardStore((state) => state.resume.sections.summary);

  if (!section.visible || isEmptyString(section.content)) return null;

  return (
    <section id={section.id}>
      <h4 className="mb-2 border-b pb-0.5 text-sm font-bold">{section.name}</h4>

      <div
        dangerouslySetInnerHTML={{ __html: section.content }}
        className="wysiwyg"
        style={{ columns: section.columns }}
      />
    </section>
  );
};

type RatingProps = { level: number };

const Rating = ({ level }: RatingProps) => {
  const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);

  return (
    <div className="relative">
      <div
        className="h-2.5 w-full rounded-sm"
        style={{ backgroundColor: hexToRgb(primaryColor, 0.4) }}
      />
      <div
        className="absolute inset-y-0 left-0 h-2.5 w-full rounded-sm bg-primary"
        style={{ width: `${linearTransform(level, 0, 5, 0, 100)}%` }}
      />
    </div>
  );
};

type LinkProps = {
  url: URL;
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  label?: string;
  className?: string;
};

const Link = ({ url, icon, iconOnRight, label, className }: LinkProps) => {
  if (!isUrl(url.href)) return null;

  return (
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight &&
        (icon ?? <i className="ph ph-bold ph-link text-primary group-[.sidebar]:text-primary" />)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
      >
        {label ?? (url.label || url.href)}
      </a>
      {iconOnRight &&
        (icon ?? <i className="ph ph-bold ph-link text-primary group-[.sidebar]:text-primary" />)}
    </div>
  );
};

type LinkedEntityProps = {
  name: string;
  url: URL;
  separateLinks: boolean;
  className?: string;
};

const LinkedEntity = ({ name, url, separateLinks, className }: LinkedEntityProps) => {
  return !separateLinks && isUrl(url.href) ? (
    <Link
      url={url}
      label={name}
      icon={<i className="ph ph-bold ph-globe text-primary group-[.sidebar]:text-primary" />}
      iconOnRight={true}
      className={className}
    />
  ) : (
    <div className={className}>{name}</div>
  );
};

type SectionProps<T> = {
  section: SectionWithItem<T> | CustomSectionGroup;
  children?: (item: T) => React.ReactNode;
  className?: string;
  urlKey?: keyof T;
  levelKey?: keyof T;
  summaryKey?: keyof T;
  keywordsKey?: keyof T;
  isHorizontal?: boolean;
};

const Section = <T,>({
  section,
  children,
  className,
  urlKey,
  levelKey,
  summaryKey,
  keywordsKey,
  isHorizontal
}: SectionProps<T>) => {
  if (!section.visible || section.items.length === 0) return null;
  const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);
  return (
    <section id={section.id} className="grid relative border-[#EEF1F6] group-[.main]:border-l group-[.main]:pl-8 group-[.main]:pb-4">
      <h4 className="pb-0.5 text-base font-bold group-[.sidebar]:text-primary mb-5">
        {section.name}
      </h4>

      <div
        className="grid gap-x-6 gap-y-3"
        style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
      >
        {section.items
          .filter((item) => item.visible)
          .map((item) => {
            const url = (urlKey && get(item, urlKey)) as URL | undefined;
            const level = (levelKey && get(item, levelKey, 0)) as number | undefined;
            const summary = (summaryKey && get(item, summaryKey, "")) as string | undefined;
            const keywords = (keywordsKey && get(item, keywordsKey, [])) as string[] | undefined;

            return (
              <div key={item.id} className={cn("space-y-2", className)}>
                <div className="flex flex-row">
                  <div className="flex-shrink-0 px-2">{isHorizontal && children?.(item as T)}</div>
                  <div>
                    {!isHorizontal && children?.(item as T)}
                    {url !== undefined && section.separateLinks && <Link url={url} />}


                    {summary !== undefined && !isEmptyString(summary) && (
                      <div dangerouslySetInnerHTML={{ __html: summary }} className={cn('wysiwyg')} style={{
                        fontSize: isHorizontal ? '10px' : 'inherit',
                      }} />
                    )}

                    {level !== undefined && level > 0 && <Rating level={level} />}

                    {keywords !== undefined && keywords.length > 0 && (
                      <p className="text-sm">{keywords.join(", ")}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="z-10 absolute left-0 top-0 -translate-x-1/2 shadow-md w-6 h-6 rounded-full bg-[#fff] flex items-center justify-between" >
        <MattsIcon
          color={primaryColor}
          colNum={6}
          rowNum={6}
          className="m-auto"
          offset='3px 2px'
          renderText={() => {
            return (
              <div className="rounded-full bg-[#333] w-2 h-2" />
            )
          }}
        />
      </div>
    </section>
  );
};

const Experience = () => {
  const section = useArtboardStore((state) => state.resume.sections.experience);
  const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);
  return (
    <Section<Experience> section={section} urlKey="url" summaryKey="summary" isHorizontal>
      {(item) => (
        <div className="w-[220px] relative left-0 top-0 flex flex-row items-center group-[.sidebar]:flex-col group-[.sidebar]:items-start" style={{
          fontSize: '10px'
        }}>
          <div className="shrink-0 text-right">
            <div className="flex flex-row pl-4">
              <div className="font-bold mr-2">{item.date}</div>
              {item.location && <div className="flex flex-row">
                <MattsIcon
                  color={primaryColor}
                  colNum={3}
                  rowNum={3}
                  className="m-auto"
                  offset='0.5px 0.5px'
                  renderText={() => {
                    return (
                      <MapPin className="w-1.5 h-1.5" color="#79819A" weight="fill" />
                    )
                  }}
                />
                <span className="text-[#79819A]">{item.location}</span>
              </div>}
            </div>
            <div className="flex flex-row my-2 group-[.main]:border-l group-[.main]:pl-4 border-[#EEF1F6]">
              <img src="/assets/icon/apple.svg" alt="apple" className="w-10 h-10 mr-2 ml-0 flex items-center justify-center"/>
              <div className="flex flex-col align-left justify-start">
                <div className="align-left">{item.position}</div>
                <div className="align-left">{item.company}</div>
              </div>
              {/* <LinkedEntity
                name={item.company}
                url={item.url}
                separateLinks={section.separateLinks}
                className="font-bold"
              /> */}
            </div>
          </div>

          <div className="z-10 absolute left-0 top-0 -translate-x-1/2 translate-y-[2px] shadow-md w-4 h-4 rounded-full bg-[#fff] flex items-center justify-between" >
            <MattsIcon
              color={primaryColor}
              colNum={4}
              rowNum={4}
              className="m-auto"
              offset='2px 2px'
              renderText={() => {
                return (
                  <div className="rounded-full bg-[#333] w-1 h-1" />
                )
              }}
            />
          </div>
        </div>
      )}
    </Section>
  );
};

const Education = () => {
  const section = useArtboardStore((state) => state.resume.sections.education);

  return (
    <Section<Education> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <LinkedEntity
              name={item.institution}
              url={item.url}
              separateLinks={section.separateLinks}
              className="font-bold"
            />
            <div>{item.area}</div>
            <div>{item.score}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
            <div>{item.studyType}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Profiles = () => {
  const section = useArtboardStore((state) => state.resume.sections.profiles);
  const fontSize = useArtboardStore((state) => state.resume.metadata.typography.font.size);

  return (
    <Section<Profile> section={section}>
      {(item) => (
        <div>
          {isUrl(item.url.href) ? (
            <Link
              url={item.url}
              label={item.username}
              icon={
                <img
                  className="ph"
                  width={fontSize}
                  height={fontSize}
                  alt={item.network}
                  src={`https://cdn.simpleicons.org/${item.icon}`}
                />
              }
            />
          ) : (
            <p>{item.username}</p>
          )}
          {!item.icon && <p className="text-sm">{item.network}</p>}
        </div>
      )}
    </Section>
  );
};

const Awards = () => {
  const section = useArtboardStore((state) => state.resume.sections.awards);

  return (
    <Section<Award> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <div className="font-bold">{item.title}</div>
            <LinkedEntity
              name={item.awarder}
              url={item.url}
              separateLinks={section.separateLinks}
            />
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Certifications = () => {
  const section = useArtboardStore((state) => state.resume.sections.certifications);

  return (
    <Section<Certification> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <div className="font-bold">{item.name}</div>
            <LinkedEntity name={item.issuer} url={item.url} separateLinks={section.separateLinks} />
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Skills = () => {
  const section = useArtboardStore((state) => state.resume.sections.skills);

  return (
    <Section<Skill> section={section} levelKey="level" keywordsKey="keywords">
      {(item) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Interests = () => {
  const section = useArtboardStore((state) => state.resume.sections.interests);

  return (
    <Section<Interest> section={section} keywordsKey="keywords" className="space-y-0.5">
      {(item) => <div className="font-bold">{item.name}</div>}
    </Section>
  );
};

const Publications = () => {
  const section = useArtboardStore((state) => state.resume.sections.publications);

  return (
    <Section<Publication> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <LinkedEntity
              name={item.name}
              url={item.url}
              separateLinks={section.separateLinks}
              className="font-bold"
            />
            <div>{item.publisher}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Volunteer = () => {
  const section = useArtboardStore((state) => state.resume.sections.volunteer);

  return (
    <Section<Volunteer> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <LinkedEntity
              name={item.organization}
              url={item.url}
              separateLinks={section.separateLinks}
              className="font-bold"
            />
            <div>{item.position}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
            <div>{item.location}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Languages = () => {
  const section = useArtboardStore((state) => state.resume.sections.languages);

  return (
    <Section<Language> section={section} levelKey="level">
      {(item) => (
        <div className="space-y-0.5">
          <div className="font-bold">{item.name}</div>
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Projects = () => {
  const section = useArtboardStore((state) => state.resume.sections.projects);

  return (
    <Section<Project> section={section} urlKey="url" summaryKey="summary" keywordsKey="keywords" className="bg-[#F8F9FC] py-2 pr-4 rounded-lg">
      {(item) => (
        <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <LinkedEntity
              name={item.name}
              url={item.url}
              separateLinks={section.separateLinks}
              className="font-bold"
            />
            <div>{item.description}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const References = () => {
  const section = useArtboardStore((state) => state.resume.sections.references);

  return (
    <Section<Reference> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Custom = ({ id }: { id: string }) => {
  const section = useArtboardStore((state) => state.resume.sections.custom[id]);

  return (
    <Section<CustomSection>
      section={section}
      urlKey="url"
      summaryKey="summary"
      keywordsKey="keywords"
    >
      {(item) => (
        <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <LinkedEntity
              name={item.name}
              url={item.url}
              separateLinks={section.separateLinks}
              className="font-bold"
            />
            <div>{item.description}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
            <div>{item.location}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const mapSectionToComponent = (section: SectionKey, isMain?: boolean) => {
  if (!isMain) return
  switch (section) {
    case "profiles": {
      return <Profiles />;
    }
    case "summary": {
      return <Summary />;
    }
    case "experience": {
      return <Experience />;
    }
    case "education": {
      return <Education />;
    }
    case "awards": {
      return <Awards />;
    }
    case "certifications": {
      return <Certifications />;
    }
    case "skills": {
      return <Skills />;
    }
    case "interests": {
      return <Interests />;
    }
    case "publications": {
      return <Publications />;
    }
    case "volunteer": {
      return <Volunteer />;
    }
    case "languages": {
      return <Languages />;
    }
    case "projects": {
      return <Projects />;
    }
    case "references": {
      return <References />;
    }
    default: {
      if (section.startsWith("custom.")) return <Custom id={section.split(".")[1]} />;

      return null;
    }
  }
};

export const Design = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;


  return (
    <div className="grid min-h-[inherit] grid-cols-4">
      <div
        className="sidebar p-custom group space-y-4"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {isFirstPage && <Header />}

        {sidebar.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
      </div>

      <div className="main p-custom group col-span-3">
        {main.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section, true)}</Fragment>
        ))}
      </div>
    </div>
  );
};
